const prisma = require("../config/prisma");
const { feedbackSchema, invitationSchema, invitationStatusSchema } = require("../validators/community.validator");
const { notifyUser } = require("../services/communityEvents");
async function feedbackList(req, res) {
  try {
    const camp = await prisma.camp.findUnique({ where: { id: req.params.campId }, select: { id: true, status: true } });
    if (!camp || !["PUBLISHED", "COMPLETED"].includes(camp.status)) return res.status(404).json({ success: false, message: "Camp not found." });
    const rows = await prisma.campFeedback.findMany({ where: { campId: camp.id }, include: { user: { select: { fullName: true } } }, orderBy: { createdAt: "desc" } });
    return res.json({ success: true, data: rows.map((item) => ({ id: item.id, name: "Verified attendee", rating: item.rating, comment: item.comment, date: item.createdAt })) });
  } catch (error) { console.error("Feedback list error:", error); return res.status(500).json({ success: false, message: "Unable to retrieve feedback." }); }
}
async function submitFeedback(req, res) {
  const parsed = feedbackSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Validation failed.", errors: parsed.error.issues });
  try {
    const camp = await prisma.camp.findUnique({ where: { id: req.params.campId }, select: { id: true, status: true } });
    if (!camp || camp.status !== "COMPLETED") return res.status(400).json({ success: false, message: "Feedback is available after a camp is completed." });
    const attended = await prisma.campRegistration.findFirst({ where: { campId: camp.id, userId: req.user.id, attendance: "PRESENT" } });
    if (!attended) return res.status(403).json({ success: false, message: "Only verified attendees can leave camp feedback." });
    const item = await prisma.campFeedback.upsert({ where: { campId_userId: { campId: camp.id, userId: req.user.id } }, create: { campId: camp.id, userId: req.user.id, ...parsed.data }, update: parsed.data });
    return res.status(201).json({ success: true, data: item });
  } catch (error) { console.error("Submit feedback error:", error); return res.status(500).json({ success: false, message: "Unable to submit feedback." }); }
}
async function sendInvitation(req, res) {
  const parsed = invitationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Validation failed.", errors: parsed.error.issues });
  try {
    const camp = await prisma.camp.findUnique({ where: { id: req.params.campId }, select: { id: true, title: true, status: true, organizationId: true } });
    if (!camp || camp.status !== "PUBLISHED") return res.status(404).json({ success: false, message: "Camp not found or not open." });
    const [membership, registration] = await Promise.all([
      prisma.organizationMember.findFirst({ where: { userId: req.user.id, organizationId: camp.organizationId, role: { in: ["OWNER", "ADMIN", "COORDINATOR"] } } }),
      prisma.campRegistration.findFirst({ where: { campId: camp.id, userId: req.user.id, status: { in: ["REGISTERED", "WAITLISTED"] } } }),
    ]);
    if (!membership && !registration) return res.status(403).json({ success: false, message: "Only camp organizers and registered participants can invite others." });
    const email = parsed.data.email.toLowerCase();
    const [recipient, sender] = await Promise.all([
      prisma.user.findUnique({ where: { email }, select: { id: true } }),
      prisma.user.findUnique({ where: { id: req.user.id }, select: { email: true } }),
    ]);
    if (email === sender.email.toLowerCase()) return res.status(400).json({ success: false, message: "You cannot invite your own account." });
    const invite = await prisma.campInvitation.create({ data: { campId: camp.id, inviterId: req.user.id, inviteeId: recipient?.id || null, inviteeEmail: email, role: parsed.data.role, message: parsed.data.message || null } });
    if (recipient) await notifyUser(recipient.id, { title: "New camp invitation", message: `You were invited to ${camp.title}.`, type: "invitation", href: "/invitations" });
    return res.status(201).json({ success: true, data: invite });
  } catch (error) { if (error.code === "P2002") return res.status(409).json({ success: false, message: "This person has already been invited to this camp by you." }); console.error("Send invitation error:", error); return res.status(500).json({ success: false, message: "Unable to send invitation." }); }
}
async function listInvitations(req, res) {
  try {
    const email = (await prisma.user.findUnique({ where: { id: req.user.id }, select: { email: true } })).email;
    const [received, sent] = await Promise.all([
      prisma.campInvitation.findMany({ where: { OR: [{ inviteeId: req.user.id }, { inviteeEmail: email }] }, include: { camp: { select: { id: true, title: true, targetAudience: true } }, inviter: { select: { fullName: true, email: true } } }, orderBy: { createdAt: "desc" } }),
      prisma.campInvitation.findMany({ where: { inviterId: req.user.id }, include: { camp: { select: { id: true, title: true, targetAudience: true } } }, orderBy: { createdAt: "desc" } }),
    ]);
    const view = (item, incoming) => ({ id: item.id, campId: item.campId, campTitle: item.camp.title, targetBeneficiary: item.camp.targetAudience, fromName: item.inviter?.fullName, fromEmail: item.inviter?.email, toEmail: item.inviteeEmail, role: item.role, message: item.message, status: item.status.toLowerCase(), createdAt: item.createdAt, ...(incoming ? {} : {}) });
    return res.json({ success: true, data: { received: received.map((x) => view(x, true)), sent: sent.map((x) => view(x, false)) } });
  } catch (error) { console.error("List invitations error:", error); return res.status(500).json({ success: false, message: "Unable to retrieve invitations." }); }
}
async function updateInvitation(req, res) {
  const parsed = invitationStatusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Validation failed.", errors: parsed.error.issues });
  try {
    const invite = await prisma.campInvitation.findUnique({ where: { id: req.params.id }, include: { camp: { select: { title: true } }, invitee: { select: { email: true } } } });
    if (!invite) return res.status(404).json({ success: false, message: "Invitation not found." });
    const me = await prisma.user.findUnique({ where: { id: req.user.id }, select: { email: true } });
    const recipient = invite.inviteeId === req.user.id || invite.inviteeEmail === me.email;
    const senderRevoke = invite.inviterId === req.user.id && parsed.data.status === "REVOKED";
    if (!recipient && !senderRevoke) return res.status(403).json({ success: false, message: "You cannot update this invitation." });
    if (invite.status !== "PENDING") return res.status(409).json({ success: false, message: "This invitation is no longer pending." });
    const updated = await prisma.campInvitation.update({ where: { id: invite.id }, data: { status: parsed.data.status } });
    if (invite.inviterId !== req.user.id) await notifyUser(invite.inviterId, { title: "Invitation response", message: `Your invitation to ${invite.camp.title} was ${parsed.data.status.toLowerCase()}.`, type: "invitation", href: "/invitations" });
    return res.json({ success: true, data: updated });
  } catch (error) { console.error("Update invitation error:", error); return res.status(500).json({ success: false, message: "Unable to update invitation." }); }
}
module.exports = { feedbackList, submitFeedback, sendInvitation, listInvitations, updateInvitation };
