#!/usr/bin/env node

// Local CLI only. This script is not imported by the server or any route.
const path = require("node:path");
const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function getEmailArgument() {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    throw new Error("Usage: node provision-admin.js <existing-user-email>");
  }

  const email = args[0].trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Provide one valid existing user's email address.");
  }
  return email;
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

async function main() {
  const email = getEmailArgument();
  assertLocalDevelopmentDatabase();

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, fullName: true, email: true, platformRole: true }
  });

  if (!user) {
    console.error(`No existing user found for ${email}. No changes made.`);
    process.exitCode = 1;
    return;
  }

  console.log(`Account found: ${user.fullName} <${user.email}>`);
  console.log(`Current platform role: ${user.platformRole}`);

  if (user.platformRole === "ADMIN") {
    console.log("This account is already ADMIN. No changes made.");
    return;
  }

  const prompt = readline.createInterface({ input: stdin, output: stdout });
  let confirmation;
  try {
    confirmation = await prompt.question(
      `Confirm promotion by typing PROMOTE ${user.email}: `
    );
  } finally {
    prompt.close();
  }

  if (confirmation !== `PROMOTE ${user.email}`) {
    console.log("Confirmation did not match. No changes made.");
    return;
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { platformRole: "ADMIN" },
    select: { fullName: true, email: true, platformRole: true }
  });

  console.log(`Promoted ${updated.fullName} <${updated.email}> to ${updated.platformRole}.`);
}

main()
  .catch((error) => {
    console.error(`Admin provisioning failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
