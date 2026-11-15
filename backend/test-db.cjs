require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`SELECT 1 AS connected`;
  console.log("DATABASE CONNECTED SUCCESSFULLY:", result);
}

main()
  .catch((error) => {
    console.error("DATABASE CONNECTION FAILED:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
