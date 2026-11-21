const prisma = require("../config/prisma");

async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 4 || args[0] !== "--email" || args[2] !== "--confirm-email") {
    throw new Error("Usage: node src/scripts/provision-admin.js --email <existing-user-email> --confirm-email <same-email>.");
  }
  const email = args[1]?.trim().toLowerCase();
  const confirmation = args[3]?.trim().toLowerCase();

  if (process.env.SEVANA_ADMIN_PROVISIONING_ENABLED !== "true") {
    throw new Error("Set SEVANA_ADMIN_PROVISIONING_ENABLED=true for this one explicit CLI invocation.");
  }
  if (!email || confirmation !== email) {
    throw new Error("Provide --email <existing-user-email> and repeat it exactly as --confirm-email <existing-user-email>.");
  }

  const outcome = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { email }, select: { id: true, platformRole: true, isActive: true } });
    if (!user || !user.isActive) throw new Error("The requested active account was not found.");
    if (user.platformRole === "ADMIN") return { id: user.id, unchanged: true };

    await tx.user.update({ where: { id: user.id }, data: { platformRole: "ADMIN" } });
    await tx.adminAuditLog.create({ data: {
      actorLabel: "EXPLICIT_BOOTSTRAP_CLI",
      action: "ADMIN_ROLE_PROVISIONED",
      entityType: "User",
      entityId: user.id,
      before: { platformRole: user.platformRole },
      after: { platformRole: "ADMIN" },
    } });
    return { id: user.id, unchanged: false };
  });

  console.log(outcome.unchanged ? `Account ${outcome.id} is already an administrator; unchanged.` : `Administrator provisioned for account ${outcome.id}.`);
}

main().catch((error) => {
  console.error(`Admin provisioning stopped: ${error.message}`);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
});
