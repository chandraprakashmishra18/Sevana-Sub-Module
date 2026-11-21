const prisma = require("../config/prisma");
const { updateProfileSchema } = require("../validators/user.validator");
async function profile(req, res) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, fullName: true, email: true, phone: true, platformRole: true, memberships: { select: { role: true, organization: { select: { id: true, name: true, type: true, verificationStatus: true } } } } } });
    if (!user) return res.status(404).json({ success: false, message: "User profile not found." });
    const [registrations, organized, donations, xpEntries] = await Promise.all([
      prisma.campRegistration.findMany({ where: { userId: user.id }, include: { camp: { select: { id: true, title: true, startsAt: true, organization: { select: { name: true } } } } }, orderBy: { registeredAt: "desc" } }),
      prisma.camp.findMany({ where: { createdById: user.id, status: { in: ["PUBLISHED", "COMPLETED"] } }, select: { id: true, title: true, startsAt: true, status: true }, orderBy: { startsAt: "desc" } }),
      prisma.donation.findMany({ where: { donorUserId: user.id }, include: { campaign: { select: { id: true, title: true } } }, orderBy: { createdAt: "desc" } }),
      prisma.userXP.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
    ]);
    const attendanceCount = registrations.filter((item) => item.attendance === "PRESENT").length;
    const badges = attendanceCount >= 1 ? ["First Service"] : [];
    if (attendanceCount >= 5) badges.push("Community Volunteer");
    if (attendanceCount >= 20) badges.push("Impact Leader");
    const totalXP = xpEntries.reduce((sum, item) => sum + item.amount, 0);
    return res.json({ success: true, data: { ...user, name: user.fullName, verifiedAttendanceCount: attendanceCount, campsJoined: registrations.map(({ camp, ...item }) => ({ ...item, campId: camp.id, title: camp.title, date: camp.startsAt, organizer: camp.organization.name })), campsOrganized: organized, donations: donations.map((item) => ({ id: item.id, campaignId: item.campaignId, campaignTitle: item.campaign?.title || "General Fund", amount: item.amount == null ? null : Number(item.amount), status: item.status, date: item.createdAt })), totalXP, xpHistory: xpEntries, badges } });
  } catch (error) { console.error("User profile error:", error); return res.status(500).json({ success: false, message: "Unable to retrieve user profile." }); }
}
async function updateProfile(req, res) {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Validation failed.", errors: parsed.error.issues });
  try {
    const user = await prisma.user.update({ where: { id: req.user.id }, data: parsed.data, select: { id: true, fullName: true, email: true, phone: true, platformRole: true } });
    return res.json({ success: true, data: { ...user, name: user.fullName } });
  } catch (error) { console.error("Update profile error:", error); return res.status(500).json({ success: false, message: "Unable to update profile." }); }
}
async function leaderboard(req, res) {
  try {
    const grouped = await prisma.userXP.groupBy({ by: ["userId"], _sum: { amount: true }, orderBy: { _sum: { amount: "desc" } }, take: 100 });
    const ids = grouped.map((item) => item.userId);
    const users = ids.length ? await prisma.user.findMany({ where: { id: { in: ids }, isActive: true }, select: { id: true, fullName: true } }) : [];
    const byId = new Map(users.map((user) => [user.id, user]));
    return res.json({ success: true, data: grouped.filter((item) => byId.has(item.userId)).map((item, index) => ({ id: item.userId, name: byId.get(item.userId).fullName, totalXP: item._sum.amount || 0, rank: index + 1 })) });
  } catch (error) { console.error("Leaderboard error:", error); return res.status(500).json({ success: false, message: "Unable to retrieve leaderboard." }); }
}
async function communityActivity(req, res) {
  try {
    const entries = await prisma.userXP.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: "desc" }, take: 100 });
    return res.json({ success: true, data: entries });
  } catch (error) { console.error("Community activity error:", error); return res.status(500).json({ success: false, message: "Unable to retrieve community activity." }); }
}
async function publicProfile(req, res) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id }, select: { id: true, fullName: true, memberships: { select: { organization: { select: { name: true } } } } } });
    if (!user) return res.status(404).json({ success: false, message: "Profile not found." });
    const [registrations, organized, xp] = await Promise.all([
      prisma.campRegistration.findMany({ where: { userId: user.id, attendance: "PRESENT" }, include: { camp: { select: { id: true, title: true, startsAt: true } } }, orderBy: { registeredAt: "desc" } }),
      prisma.camp.findMany({ where: { createdById: user.id, status: { in: ["PUBLISHED", "COMPLETED"] } }, select: { id: true, title: true, startsAt: true, status: true }, orderBy: { startsAt: "desc" } }),
      prisma.userXP.aggregate({ where: { userId: user.id }, _sum: { amount: true } }),
    ]);
    const count = registrations.length;
    return res.json({ success: true, data: { id: user.id, name: user.fullName, role: user.memberships[0]?.organization.name || "Community member", totalXP: xp._sum.amount || 0, campsWorked: registrations.map((x) => ({ campId: x.camp.id, title: x.camp.title, date: x.camp.startsAt, role: x.role })), campsOrganized: organized, badges: count >= 20 ? ["First Service", "Community Volunteer", "Impact Leader"] : count >= 5 ? ["First Service", "Community Volunteer"] : count ? ["First Service"] : [] } });
  } catch (error) { console.error("Public profile error:", error); return res.status(500).json({ success: false, message: "Unable to retrieve profile." }); }
}
module.exports = { profile, updateProfile, leaderboard, communityActivity, publicProfile };
