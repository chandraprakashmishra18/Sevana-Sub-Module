#!/usr/bin/env node

// Local operator CLI. This file is not imported by the HTTP server or routes.
const path = require("node:path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, ".env") });

const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { stdin, stdout } = require("node:process");
const readline = require("node:readline/promises");

function getEmailArgument() {
  const args = process.argv.slice(2);
  if (args.length !== 1 && !(args.length === 3 && args[1] === "--name")) {
    throw new Error("Usage: node provision-admin.js <account-email> [--name <full-name>]");
  }

  const email = args[0].trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Provide one valid account email address.");
  }
  const suppliedName = args.length === 3 ? args[2].trim() : null;
  if (suppliedName && (suppliedName.length < 2 || suppliedName.length > 120)) {
    throw new Error("Account name must be between 2 and 120 characters.");
  }
  return { email, suppliedName };
}

function assertLocalDevelopmentDatabase() {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Admin provisioning is allowed only with NODE_ENV=development.");
  }

  let databaseUrl;
  try {
    databaseUrl = new URL(process.env.DATABASE_URL);
  } catch {
    throw new Error("DATABASE_URL must point to a local development database.");
  }

  if (!["localhost", "127.0.0.1", "::1"].includes(databaseUrl.hostname)) {
    throw new Error("Admin provisioning is allowed only for a loopback database host.");
  }
}

function readHidden(promptText) {
  if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
    throw new Error("Secure password entry requires an interactive terminal.");
  }

  stdout.write(promptText);
  stdin.setEncoding("utf8");
  stdin.setRawMode(true);
  stdin.resume();

  return new Promise((resolve, reject) => {
    let value = "";
    const cleanup = () => {
      stdin.removeListener("data", onData);
      stdin.setRawMode(false);
      stdout.write("\n");
    };
    const onData = (chunk) => {
      for (const char of chunk) {
        if (char === "\u0003") {
          cleanup();
          reject(new Error("Password entry cancelled."));
          return;
        }
        if (char === "\r" || char === "\n") {
          cleanup();
          resolve(value);
          return;
        }
        if (char === "\u007f" || char === "\b") {
          value = value.slice(0, -1);
        } else if (char >= " ") {
          value += char;
        }
      }
    };
    stdin.on("data", onData);
  });
}

async function askLine(promptText) {
  const prompt = readline.createInterface({ input: stdin, output: stdout });
  try {
    return await prompt.question(promptText);
  } finally {
    prompt.close();
  }
}

function isStrongPassword(password) {
  return Buffer.byteLength(password, "utf8") <= 72 &&
    [...password].length >= 12 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password);
}

async function verifyAdminLogin(email, password) {
  const apiUrl = new URL(`http://127.0.0.1:${process.env.PORT || 5000}/api`);
  try {
    const loginResponse = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!loginResponse.ok) return { login: false, adminOrganizations: false };

    const loginResult = await loginResponse.json();
    const accessToken = loginResult?.data?.accessToken;
    if (!accessToken) return { login: false, adminOrganizations: false };

    const organizationsResponse = await fetch(`${apiUrl}/admin/organizations`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${accessToken}` }
    });
    if (!organizationsResponse.ok) {
      return { login: true, adminOrganizations: false };
    }

    const organizationsResult = await organizationsResponse.json();
    const organizations = organizationsResult?.data;
    return {
      login: true,
      adminOrganizations: true,
      organizationCount: Array.isArray(organizations) ? organizations.length : null
    };
  } catch {
    return { login: false, adminOrganizations: false };
  }
}

async function main() {
  const { email, suppliedName } = getEmailArgument();
  assertLocalDevelopmentDatabase();

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true, fullName: true, email: true, platformRole: true, isActive: true }
  });

  let fullName;
  let operation;
  if (existing) {
    if (!existing.isActive) {
      throw new Error("The existing account is inactive; provisioning will not change isActive.");
    }
    fullName = existing.fullName;
    operation = `update only passwordHash and platformRole (current role: ${existing.platformRole})`;
    console.log(`Existing account: ${existing.fullName} <${existing.email}>`);
    console.log(`Current platform role: ${existing.platformRole}`);
  } else {
    fullName = suppliedName || (await askLine("New admin account name: ")).trim();
    if (fullName.length < 2 || fullName.length > 120) {
      throw new Error("Account name must be between 2 and 120 characters.");
    }
    operation = "create a new user with platformRole ADMIN";
    console.log(`New account to create: ${fullName} <${email}>`);
  }

  console.log(`Intended operation: ${operation}.`);
  const requiredConfirmation = `PROVISION ADMIN ${email}`;
  const confirmation = await askLine(`Type ${requiredConfirmation} to continue: `);
  if (confirmation !== requiredConfirmation) {
    console.log("Confirmation did not match. No changes made.");
    return;
  }

  let password = await readHidden("New strong password (input hidden): ");
  if (!isStrongPassword(password)) {
    throw new Error("Password must be 12+ characters with upper, lower, number, and symbol; maximum 72 UTF-8 bytes.");
  }
  const passwordAgain = await readHidden("Re-enter password (input hidden): ");
  if (password !== passwordAgain) {
    throw new Error("Passwords did not match. No changes made.");
  }

  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
  if (!Number.isInteger(rounds) || rounds < 4 || rounds > 31) {
    throw new Error("BCRYPT_SALT_ROUNDS must be an integer from 4 to 31.");
  }
  const passwordHash = await bcrypt.hash(password, rounds);

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { passwordHash, platformRole: "ADMIN" }
    });
    console.log(`Updated admin account: ${existing.fullName} <${existing.email}>.`);
  } else {
    await prisma.user.create({
      data: { fullName, email, passwordHash, platformRole: "ADMIN" }
    });
    console.log(`Created admin account: ${fullName} <${email}>.`);
  }

  const provisionedUser = await prisma.user.findUnique({
    where: { email },
    select: { platformRole: true }
  });
  console.log(`Database ADMIN role: ${provisionedUser?.platformRole === "ADMIN" ? "CONFIRMED" : "NOT CONFIRMED"}.`);

  const verification = await verifyAdminLogin(email, password);
  password = "";
  console.log(`Login via /api/auth/login: ${verification.login ? "PASS" : "NOT VERIFIED"}.`);
  if (verification.adminOrganizations) {
    const count = verification.organizationCount;
    console.log(`Protected /api/admin/organizations: PASS${count === null ? "." : ` (${count} records loaded).`}`);
  } else {
    console.log("Protected /api/admin/organizations: NOT VERIFIED.");
  }
}

main()
  .catch((error) => {
    console.error(`Admin provisioning failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
