const prisma = require("../config/prisma");
const { createOrganizationSchema, updateOrganizationSchema } = require("../validators/organization.validator");
async function manager(userId, organizationId) { return Boolean(await prisma.organizationMember.findFirst({ where: { userId, organizationId, role: { in: ["OWNER", "ADMIN"] } } })); }
function validate(schema, body, res) { const r = schema.safeParse(body); if (!r.success) { res.status(400).json({ success: false, message: "Validation failed.", errors: r.error.issues }); return null; } return r.data; }
async function list(req, res) {
  try {
    const where = req.mine === true || req.query.mine === "true" ? { members: { some: { userId: req.user.id } } } : { verificationStatus: "VERIFIED" };
    const rows = await prisma.organization.findMany({ where, select: { id: true, name: true, type: true, description: true, email: true, phone: true, website: true, address: true, city: true, state: true, verificationStatus: true, createdAt: true, _count: { select: { camps: true, campaigns: true } } }, orderBy: { name: "asc" } });
    return res.json({ success: true, data: rows });
  } catch (error) { console.error("List organizations error:", error); return res.status(500).json({ success: false, message: "Unable to retrieve organizations." }); }
}
async function get(req, res) {
  try {
    const row = await prisma.organization.findUnique({ where: { id: req.params.id }, select: { id: true, name: true, type: true, description: true, email: true, phone: true, website: true, address: true, city: true, state: true, verificationStatus: true, createdAt: true, _count: { select: { camps: true, campaigns: true } } } });
    if (!row || (row.verificationStatus !== "VERIFIED" && (!req.user || !(await manager(req.user.id, row.id))))) return res.status(404).json({ success: false, message: "Organization not found." });
    return res.json({ success: true, data: row });
  } catch (error) { console.error("Get organization error:", error); return res.status(500).json({ success: false, message: "Unable to retrieve organization." }); }
}
async function create(req, res) {
  const data = validate(createOrganizationSchema, req.body, res); if (!data) return;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({ data: { ...data, email: data.email || null, website: data.website || null } });
      await tx.organizationMember.create({ data: { organizationId: organization.id, userId: req.user.id, role: "OWNER" } });
      return organization;
    });
    return res.status(201).json({ success: true, data: result });
  } catch (error) { console.error("Create organization error:", error); return res.status(500).json({ success: false, message: "Unable to create organization." }); }
}
async function update(req, res) {
  const data = validate(updateOrganizationSchema, req.body, res); if (!data) return;
  try {
    if (!(await manager(req.user.id, req.params.id))) return res.status(403).json({ success: false, message: "You cannot manage this organization." });
    const row = await prisma.organization.update({ where: { id: req.params.id }, data: { ...data, email: data.email === "" ? null : data.email, website: data.website === "" ? null : data.website } });
    return res.json({ success: true, data: row });
  } catch (error) { console.error("Update organization error:", error); return res.status(500).json({ success: false, message: "Unable to update organization." }); }
}
async function campaigns(req, res) {
  try {
    const organization = await prisma.organization.findUnique({ where: { id: req.params.id }, select: { id: true, verificationStatus: true } });
    if (!organization || (organization.verificationStatus !== "VERIFIED" && (!req.user || !(await manager(req.user.id, organization.id))))) return res.status(404).json({ success: false, message: "Organization not found." });
    const rows = await prisma.campaign.findMany({ where: { organizationId: organization.id, ...(organization.verificationStatus === "VERIFIED" ? { status: "ACTIVE" } : {}) }, include: { organization: { select: { name: true, verificationStatus: true } } }, orderBy: { createdAt: "desc" } });
    const totals = rows.length ? await prisma.donation.groupBy({ by: ["campaignId"], where: { campaignId: { in: rows.map((campaign) => campaign.id) }, status: "SUCCESSFUL" }, _sum: { amount: true }, _count: { _all: true } }) : [];
    const byCampaign = new Map(totals.map((item) => [item.campaignId, item]));
    return res.json({ success: true, data: rows.map((campaign) => {
      const total = byCampaign.get(campaign.id);
      return { ...campaign, goalAmount: campaign.goalAmount == null ? null : Number(campaign.goalAmount), raisedAmount: Number(total?._sum.amount || 0), donorCount: total?._count._all || 0, ngo: campaign.organization.name, ngoVerified: campaign.organization.verificationStatus === "VERIFIED", category: campaign.category };
    }) });
  } catch (error) { console.error("Organization campaigns error:", error); return res.status(500).json({ success: false, message: "Unable to retrieve organization campaigns." }); }
}
async function donations(req, res) {
  try {
    if (!(await manager(req.user.id, req.params.id))) return res.status(403).json({ success: false, message: "You cannot view this organization's donations." });
    const rows = await prisma.donation.findMany({ where: { campaign: { organizationId: req.params.id } }, select: { id: true, campaignId: true, donorName: true, amount: true, currency: true, type: true, status: true, isAnonymous: true, createdAt: true }, orderBy: { createdAt: "desc" } });
    return res.json({ success: true, data: rows.map((x) => ({ ...x, donorName: x.isAnonymous ? "Anonymous Supporter" : x.donorName, amount: x.amount == null ? null : Number(x.amount) })) });
  } catch (error) { console.error("Organization donation history error:", error); return res.status(500).json({ success: false, message: "Unable to retrieve organization donations." }); }
}
module.exports = { list, get, create, update, campaigns, donations };
