#!/usr/bin/env node

// Read-only local CLI verification. Password and JWT are never printed.
const path = require("node:path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, ".env") });

const { stdin, stdout } = require("node:process");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function getEmail() {
  const args = process.argv.slice(2);
  if (args.length !== 1) throw new Error("Usage: node verify-admin-access.js <account-email>");
  return args[0].trim().toLowerCase();
}

function assertLocalDevelopmentDatabase() {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Verification is allowed only with NODE_ENV=development.");
  }
  const databaseUrl = new URL(process.env.DATABASE_URL);
  if (!["localhost", "127.0.0.1", "::1"].includes(databaseUrl.hostname)) {
    throw new Error("Verification is allowed only for a loopback database host.");
  }
}

function readHidden(promptText) {
  if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
    throw new Error("Password entry requires an interactive terminal.");
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
        if (char === "\u007f" || char === "\b") value = value.slice(0, -1);
        else if (char >= " ") value += char;
      }
    };
    stdin.on("data", onData);
  });
}

async function main() {
  const email = getEmail();
  assertLocalDevelopmentDatabase();
  const user = await prisma.user.findUnique({
    where: { email },
    select: { fullName: true, email: true, platformRole: true, isActive: true }
  });
  if (!user) throw new Error("Account not found.");
  console.log(`Account: ${user.fullName} <${user.email}>; role=${user.platformRole}; active=${user.isActive}.`);
  if (!user.isActive || user.platformRole !== "ADMIN") {
    throw new Error("Account is not an active ADMIN; login verification was not attempted.");
  }

  let password = await readHidden("Admin password (input hidden): ");
  const baseUrl = `http://127.0.0.1:${process.env.PORT || 5000}/api`;
  try {
    const loginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password })
    });
    password = "";
    const loginResult = await loginResponse.json().catch(() => null);
    if (!loginResponse.ok) {
      console.log(`Login: FAIL (HTTP ${loginResponse.status}: ${loginResult?.message || "login request failed"}).`);
      return;
    }

    let accessToken = loginResult?.data?.accessToken;
    const role = loginResult?.data?.user?.platformRole;
    if (!accessToken || role !== "ADMIN") {
      accessToken = "";
      console.log("Login: FAIL (response did not contain an ADMIN session).");
      return;
    }
    console.log("Login via /api/auth/login: PASS.");

    const organizationsResponse = await fetch(`${baseUrl}/admin/organizations`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${accessToken}` }
    });
    const organizationsResult = await organizationsResponse.json().catch(() => null);
    accessToken = "";
    if (!organizationsResponse.ok || organizationsResult?.success !== true) {
      console.log(`Admin organizations endpoint: FAIL (HTTP ${organizationsResponse.status}: ${organizationsResult?.message || "request failed"}).`);
      return;
    }

    const count = Array.isArray(organizationsResult.data) ? organizationsResult.data.length : 0;
    console.log(`Admin organizations endpoint: PASS (${count} pending organizations loaded).`);
  } catch {
    password = "";
    console.log("API verification: FAIL (local backend could not be reached).");
  }
}

main()
  .catch((error) => {
    console.error(`Verification stopped: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
