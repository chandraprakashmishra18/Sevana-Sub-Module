const prisma = require("../config/prisma");
const { createCampaignSchema, updateCampaignSchema } = require("../validators/campaign.validator");
const CATEGORY_TO_UI = { STUDENT_SPONSORSHIP: "Student Sponsorship", MEDICAL_AID: "Medical Aid", FOOD_SUPPORT: "Family Aid", CLOTHING_SUPPORT: "In-Kind Giving", EMERGENCY_RELIEF: "Family Aid", EDUCATION: "Student Sponsorship", HEALTH: "Medical Aid", OTHER: "Family Aid" };
const BENEFICIARY_TO_UI = { GENERAL: "General", CHILDREN: "Orphanage", WOMEN: "General", ELDERLY: "Old Age Home", PERSONS_WITH_DISABILITIES: "General", STUDENTS: "General", FAMILIES: "General" };
function validate(schema, body, res) { const r = schema.safeParse(body); if (!r.success) { res.status(400).json({ success: false, message: "Validation failed.", errors: r.error.issues }); return null; } return r.data; }
async function canManage(userId, organizationId) { return Boolean(await prisma.organizationMember.findFirst({ where: { userId, organizationId, role: { in: ["OWNER", "ADMIN", "COORDINATOR"] } } })); }
async function withTotals(campaign) {
  const [totals, count] = await Promise.all([
    prisma.donation.aggregate({ where: { campaignId: campaign.id, status: "SUCCESSFUL", type: "MONEY" }, _sum: { amount: true } }),
    prisma.donation.count({ where: { campaignId: campaign.id, status: "SUCCESSFUL" } }),
  ]);
  return { ...campaign, organizationName: campaign.organization?.name, organizationStatus: campaign.organization?.verificationStatus,
    raisedAmount: Number(totals._sum.amount || 0), donorCount: count, categoryLabel: CATEGORY_TO_UI[campaign.category], targetBeneficiary: BENEFICIARY_TO_UI[campaign.beneficiaryGroup], ngo: campaign.organization?.name || "Organization", ngoVerified: campaign.organization?.verificationStatus === "VERIFIED", image: campaign.imageUrl || "", location: campaign.location || "", deadline: campaign.endDate?.toISOString?.().slice(0, 10) || "", urgent: false,
    organization: undefined };
}
async function listCampaigns(req, res) {
  try {
    const where = {};
    if (req.mine === true || req.query.mine === "true") {
      if (!req.user) return res.status(401).json({ success: false, message: "Authentication required." });
      where.organization = { members: { some: { userId: req.user.id, role: { in: ["OWNER", "ADMIN", "COORDINATOR"] } } } };
    } else { where.status = "ACTIVE"; where.organization = { verificationStatus: "VERIFIED" }; }
    if (req.query.category) where.category = String(req.query.category).toUpperCase();
    if (req.query.search) where.OR = ["title", "description", "location"].map((field) => ({ [field]: { contains: String(req.query.search), mode: "insensitive" } }));
    const campaigns = await prisma.campaign.findMany({ where, include: { organization: { select: { name: true, verificationStatus: true } } }, orderBy: { createdAt: "desc" } });
    const ids = campaigns.map((campaign) => campaign.id);
    const totals = ids.length ? await prisma.donation.groupBy({ by: ["campaignId"], where: { campaignId: { in: ids }, status: "SUCCESSFUL" }, _sum: { amount: true }, _count: { _all: true } }) : [];
    const byCampaign = new Map(totals.map((item) => [item.campaignId, item]));
    const data = campaigns.map((campaign) => {
      const total = byCampaign.get(campaign.id);
      return { ...campaign, organizationName: campaign.organization?.name, organizationStatus: campaign.organization?.verificationStatus,
        raisedAmount: Number(total?._sum.amount || 0), donorCount: total?._count._all || 0, categoryLabel: CATEGORY_TO_UI[campaign.category],
        targetBeneficiary: BENEFICIARY_TO_UI[campaign.beneficiaryGroup], ngo: campaign.organization?.name || "Organization",
        ngoVerified: campaign.organization?.verificationStatus === "VERIFIED", image: campaign.imageUrl || "", location: campaign.location || "",
        deadline: campaign.endDate?.toISOString?.().slice(0, 10) || "", urgent: false, organization: undefined };
    });
    return res.json({ success: true, data });
  } catch (error) { console.error("List campaigns error:", error); return res.status(500).json({ success: false, message: "Unable to retrieve campaigns." }); }
}
async function getCampaign(req, res) {
  try {
    const campaign = await prisma.campaign.findUnique({ where: { id: req.params.id }, include: { organization: { select: { id: true, name: true, type: true, description: true, verificationStatus: true } } } });
    if (!campaign || (campaign.status !== "ACTIVE" && (!req.user || !(await canManage(req.user.id, campaign.organizationId)))) || (campaign.status === "ACTIVE" && campaign.organization?.verificationStatus !== "VERIFIED")) return res.status(404).json({ success: false, message: "Campaign not found." });
    return res.json({ success: true, data: await withTotals(campaign) });
  } catch (error) { console.error("Get campaign error:", error); return res.status(500).json({ success: false, message: "Unable to retrieve campaign." }); }
}
async function createCampaign(req, res) {
  const data = validate(createCampaignSchema, req.body, res); if (!data) return;
  try {
    const membership = await prisma.organizationMember.findFirst({ where: { userId: req.user.id, role: { in: ["OWNER", "ADMIN", "COORDINATOR"] } }, orderBy: { createdAt: "asc" } });
    if (!membership) return res.status(403).json({ success: false, message: "An organization owner or coordinator account is required." });
    const campaign = await prisma.campaign.create({ data: { ...data, goalAmount: data.goalAmount, organizationId: membership.organizationId, createdById: req.user.id, status: "DRAFT" }, include: { organization: { select: { id: true, name: true, type: true, verificationStatus: true } } } });
    return res.status(201).json({ success: true, data: await withTotals(campaign) });
  } catch (error) { console.error("Create campaign error:", error); return res.status(500).json({ success: false, message: "Unable to create campaign." }); }
}
async function updateCampaign(req, res) {
  const data = validate(updateCampaignSchema, req.body, res); if (!data) return;
  try {
    const current = await prisma.campaign.findUnique({ where: { id: req.params.id }, include: { organization: true } });
    if (!current) return res.status(404).json({ success: false, message: "Campaign not found." });
    if (!(await canManage(req.user.id, current.organizationId))) return res.status(403).json({ success: false, message: "You cannot manage this organization's campaign." });
    if (data.status === "ACTIVE" && current.organization.verificationStatus !== "VERIFIED") return res.status(403).json({ success: false, message: "Only verified organizations can publish campaigns." });
    const campaign = await prisma.campaign.update({ where: { id: current.id }, data, include: { organization: { select: { id: true, name: true, type: true, verificationStatus: true } } } });
    return res.json({ success: true, data: await withTotals(campaign) });
  } catch (error) { console.error("Update campaign error:", error); return res.status(500).json({ success: false, message: "Unable to update campaign." }); }
}
async function campaignDonations(req, res) {
  try {
    const campaign = await prisma.campaign.findUnique({ where: { id: req.params.id }, select: { id: true, status: true, organizationId: true, organization: { select: { verificationStatus: true } } } });
    if (!campaign || (campaign.status !== "ACTIVE" && (!req.user || !(await canManage(req.user.id, campaign.organizationId)))) || (campaign.status === "ACTIVE" && campaign.organization.verificationStatus !== "VERIFIED")) return res.status(404).json({ success: false, message: "Campaign not found." });
    const rows = await prisma.donation.findMany({ where: { campaignId: campaign.id, status: "SUCCESSFUL" }, select: { donorName: true, amount: true, currency: true, isAnonymous: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 20 });
    return res.json({ success: true, data: rows.map((row) => ({ name: row.isAnonymous ? "Anonymous Supporter" : row.donorName || "Supporter", amount: Number(row.amount || 0), currency: row.currency, date: row.createdAt })) });
  } catch (error) { console.error("List campaign donation details error:", error); return res.status(500).json({ success: false, message: "Unable to retrieve campaign donations." }); }
}
async function campaignDisbursements(req, res) {
  try {
    const campaign = await prisma.campaign.findUnique({ where: { id: req.params.id }, select: { id: true, status: true, organizationId: true, organization: { select: { verificationStatus: true } } } });
    if (!campaign || (campaign.status !== "ACTIVE" && (!req.user || !(await canManage(req.user.id, campaign.organizationId)))) || (campaign.status === "ACTIVE" && campaign.organization.verificationStatus !== "VERIFIED")) return res.status(404).json({ success: false, message: "Campaign not found." });
    const rows = await prisma.aidDistribution.findMany({ where: { campaignId: req.params.id }, select: { id: true, amount: true, currency: true, itemDescription: true, notes: true, distributedAt: true }, orderBy: { distributedAt: "desc" } });
    return res.json({ success: true, data: rows.map((row) => ({ id: row.id, amount: Number(row.amount || 0), description: row.itemDescription || row.notes || "Resource distribution", date: row.distributedAt, currency: row.currency })) });
  } catch (error) { console.error("List disbursements error:", error); return res.status(500).json({ success: false, message: "Unable to retrieve disbursements." }); }
}
module.exports = { listCampaigns, getCampaign, createCampaign, updateCampaign, campaignDonations, campaignDisbursements };
