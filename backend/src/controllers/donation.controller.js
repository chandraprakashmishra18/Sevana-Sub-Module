const prisma = require("../config/prisma");
const { donationIntentSchema } = require("../validators/campaign.validator");
async function createIntent(req, res) {
  const parsed = donationIntentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Validation failed.", errors: parsed.error.issues });
  try {
    if (parsed.data.campaignId) {
      const campaign = await prisma.campaign.findUnique({ where: { id: parsed.data.campaignId }, select: { id: true, status: true } });
      if (!campaign || campaign.status !== "ACTIVE") return res.status(404).json({ success: false, message: "Campaign is not accepting donation intents." });
    }
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { fullName: true, email: true } });
    const donation = await prisma.donation.create({ data: { campaignId: parsed.data.campaignId || null, donorUserId: req.user.id, donorName: parsed.data.anonymous ? null : user.fullName, donorEmail: parsed.data.anonymous ? null : user.email, type: "MONEY", amount: parsed.data.amount, isAnonymous: parsed.data.anonymous, status: "PENDING" }, select: { id: true, campaignId: true, donorName: true, amount: true, currency: true, status: true, isAnonymous: true, createdAt: true } });
    return res.status(201).json({ success: true, message: "Donation intent recorded. Payment has not been processed.", data: { ...donation, amount: Number(donation.amount), paymentStatus: "NOT_STARTED" } });
  } catch (error) { console.error("Create donation intent error:", error); return res.status(500).json({ success: false, message: "Unable to record donation intent." }); }
}
async function myDonations(req, res) {
  try {
    const rows = await prisma.donation.findMany({ where: { donorUserId: req.user.id }, select: { id: true, campaignId: true, donorName: true, amount: true, currency: true, status: true, isAnonymous: true, createdAt: true }, orderBy: { createdAt: "desc" } });
    return res.json({ success: true, data: rows.map((row) => ({ ...row, amount: row.amount == null ? null : Number(row.amount), paymentStatus: row.status === "SUCCESSFUL" ? "SUCCESSFUL" : row.status === "FAILED" ? "FAILED" : "PENDING" })) });
  } catch (error) { console.error("Donation history error:", error); return res.status(500).json({ success: false, message: "Unable to retrieve donation history." }); }
}
module.exports = { createIntent, myDonations };
