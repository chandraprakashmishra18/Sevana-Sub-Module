const prisma = require("../config/prisma");
async function list(req, res) {
  try {
    const [rows, unreadCount] = await Promise.all([
      prisma.notification.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: "desc" }, take: 100 }),
      prisma.notification.count({ where: { userId: req.user.id, isRead: false } }),
    ]);
    return res.json({ success: true, data: rows.map((row) => ({ ...row, read: row.isRead })), unreadCount });
  } catch (error) { console.error("Notifications error:", error); return res.status(500).json({ success: false, message: "Unable to retrieve notifications." }); }
}
async function markRead(req, res) {
  try {
    const result = await prisma.notification.updateMany({ where: { id: req.params.id, userId: req.user.id }, data: { isRead: true } });
    if (!result.count) return res.status(404).json({ success: false, message: "Notification not found." });
    return res.json({ success: true, data: { id: req.params.id, read: true } });
  } catch (error) { console.error("Mark notification read error:", error); return res.status(500).json({ success: false, message: "Unable to update notification." }); }
}
async function markAllRead(req, res) {
  try { const result = await prisma.notification.updateMany({ where: { userId: req.user.id, isRead: false }, data: { isRead: true } }); return res.json({ success: true, data: { updatedCount: result.count } }); }
  catch (error) { console.error("Mark all notifications read error:", error); return res.status(500).json({ success: false, message: "Unable to update notifications." }); }
}
module.exports = { list, markRead, markAllRead };
