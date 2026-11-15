require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "admin.test@sevana.local" },
    select: { id: true, email: true, platformRole: true }
  });

  if (!user) {
    console.log("Admin test user not found. Register it first.");
    return;
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { platformRole: "ADMIN" },
    select: { id: true, email: true, platformRole: true }
  });

  console.log("Admin account updated:", updated);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
