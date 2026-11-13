const prisma = require("../config/prisma");

async function checkDatabase() {
  await prisma.$queryRaw`SELECT 1`;
  return true;
}

module.exports = { checkDatabase };
