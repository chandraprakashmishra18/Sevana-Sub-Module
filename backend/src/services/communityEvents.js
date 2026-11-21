const prisma = require("../config/prisma");

async function notifyUser(userId, { title, message, type = "update", href }) {
  return prisma.notification.create({ data: { userId, title, message, type, href } });
}
async function awardXP(userId, eventType, eventId, amount) {
  try { await prisma.userXP.create({ data: { userId, eventType, eventId, amount } }); return true; }
  catch (error) { if (error.code === "P2002") return false; throw error; }
}
module.exports = { notifyUser, awardXP };
