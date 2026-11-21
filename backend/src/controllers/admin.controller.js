const prisma = require("../config/prisma");
const {
  paginationSchema,
  organizationListSchema,
  campaignListSchema,
  contactListSchema,
  organizationModerationSchema,
  campaignModerationSchema,
  contactReviewSchema,
  platformRoleSchema,
  adminUserListSchema,
} = require("../validators/admin.validator");

function invalid(res, issues) {
  return res.status(400).json({ success: false, message: "Validation failed.", errors: issues });
}

async function getSummary(_req, res) {
  try {
    const [organizations, campaigns, contactMessages] = await Promise.all([
      prisma.organization.groupBy({ by: ["verificationStatus"], _count: { _all: true } }),
      prisma.campaign.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.contactMessage.groupBy({ by: ["status"], _count: { _all: true } }),
    ]);
    const counts = (rows, key, values) => Object.fromEntries(values.map((value) => [value, rows.find((row) => row[key] === value)?._count._all || 0]));
    const organizationCounts = counts(organizations, "verificationStatus", ["PENDING", "VERIFIED", "REJECTED", "SUSPENDED"]);
    const campaignCounts = counts(campaigns, "status", ["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"]);
    const contactCounts = counts(contactMessages, "status", ["NEW", "REVIEWED", "CLOSED"]);
    return res.json({ success: true, data: {
      organizations: { total: Object.values(organizationCounts).reduce((sum, value) => sum + value, 0), byStatus: organizationCounts },
      campaigns: { total: Object.values(campaignCounts).reduce((sum, value) => sum + value, 0), byStatus: campaignCounts },
      contactMessages: { total: Object.values(contactCounts).reduce((sum, value) => sum + value, 0), byStatus: contactCounts },
    } });
  } catch (error) {
    console.error("Admin summary retrieval failed.", error?.code || "unknown");
    return res.status(503).json({ success: false, message: "Unable to retrieve platform summary." });
  }
}

async function listAdminUsers(req, res) {
  const parsed = adminUserListSchema.safeParse(req.query);
  if (!parsed.success) return invalid(res, parsed.error.issues);
  const { search, limit, offset } = parsed.data;
  try {
    const rows = await prisma.user.findMany({
      where: search ? { OR: [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ] } : {},
      select: { id: true, fullName: true, email: true, platformRole: true, isActive: true, createdAt: true },
      orderBy: { createdAt: "desc" }, take: limit, skip: offset,
    });
    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Admin account list failed.", error?.code || "unknown");
    return res.status(503).json({ success: false, message: "Unable to retrieve accounts for role management." });
  }
}

async function listOrganizations(req, res) {
  const parsed = organizationListSchema.safeParse(req.query);
  if (!parsed.success) return invalid(res, parsed.error.issues);
  const { status, limit, offset } = parsed.data;
  try {
    const rows = await prisma.organization.findMany({
      where: status ? { verificationStatus: status } : {},
      select: { id: true, name: true, type: true, email: true, city: true, state: true, verificationStatus: true, createdAt: true },
      orderBy: { createdAt: "asc" }, take: limit, skip: offset,
    });
    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Admin organization review list failed.", error?.code || "unknown");
    return res.status(503).json({ success: false, message: "Unable to retrieve organizations for review." });
  }
}

async function moderateOrganization(req, res) {
  const parsed = organizationModerationSchema.safeParse(req.body);
  if (!parsed.success) return invalid(res, parsed.error.issues);
  try {
    const result = await prisma.$transaction(async (tx) => {
      const current = await tx.organization.findUnique({ where: { id: req.params.id }, select: { id: true, verificationStatus: true, verifiedAt: true } });
      if (!current) return null;
      const updated = await tx.organization.update({
        where: { id: current.id },
        data: { verificationStatus: parsed.data.status, verifiedAt: parsed.data.status === "VERIFIED" ? new Date() : null },
        select: { id: true, name: true, verificationStatus: true, verifiedAt: true, updatedAt: true },
      });
      await tx.adminAuditLog.create({ data: {
        actorUserId: req.user.id,
        actorLabel: "PLATFORM_ADMIN",
        action: "ORGANIZATION_VERIFICATION_CHANGED",
        entityType: "Organization",
        entityId: current.id,
        before: { verificationStatus: current.verificationStatus, verifiedAt: current.verifiedAt?.toISOString() || null },
        after: { verificationStatus: updated.verificationStatus, verifiedAt: updated.verifiedAt?.toISOString() || null, reason: parsed.data.reason },
      } });
      return updated;
    });
    if (!result) return res.status(404).json({ success: false, message: "Organization not found." });
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error("Admin organization verification failed.", error?.code || "unknown");
    return res.status(503).json({ success: false, message: "Unable to update organization verification." });
  }
}

async function listCampaigns(req, res) {
  const parsed = campaignListSchema.safeParse(req.query);
  if (!parsed.success) return invalid(res, parsed.error.issues);
  const { status, limit, offset } = parsed.data;
  try {
    const rows = await prisma.campaign.findMany({
      where: status ? { status } : {},
      select: { id: true, title: true, description: true, category: true, beneficiaryGroup: true, goalAmount: true, currency: true, location: true, startDate: true, endDate: true, status: true, organizationId: true, createdAt: true, organization: { select: { name: true, verificationStatus: true } } },
      orderBy: { createdAt: "asc" }, take: limit, skip: offset,
    });
    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Admin campaign review list failed.", error?.code || "unknown");
    return res.status(503).json({ success: false, message: "Unable to retrieve campaigns for review." });
  }
}

async function moderateCampaign(req, res) {
  const parsed = campaignModerationSchema.safeParse(req.body);
  if (!parsed.success) return invalid(res, parsed.error.issues);
  try {
    const result = await prisma.$transaction(async (tx) => {
      const current = await tx.campaign.findUnique({ where: { id: req.params.id }, include: { organization: { select: { verificationStatus: true } } } });
      if (!current) return { missing: true };
      if (parsed.data.status === "ACTIVE" && current.organization.verificationStatus !== "VERIFIED") return { blocked: true };
      const updated = await tx.campaign.update({ where: { id: current.id }, data: { status: parsed.data.status }, select: { id: true, title: true, status: true, organizationId: true, updatedAt: true } });
      await tx.adminAuditLog.create({ data: {
        actorUserId: req.user.id,
        actorLabel: "PLATFORM_ADMIN",
        action: "CAMPAIGN_MODERATION_CHANGED",
        entityType: "Campaign",
        entityId: current.id,
        before: { status: current.status },
        after: { status: updated.status, reason: parsed.data.reason },
      } });
      return { updated };
    });
    if (result.missing) return res.status(404).json({ success: false, message: "Campaign not found." });
    if (result.blocked) return res.status(409).json({ success: false, message: "Campaign cannot be activated until its organization is verified." });
    return res.json({ success: true, data: result.updated });
  } catch (error) {
    console.error("Admin campaign moderation failed.", error?.code || "unknown");
    return res.status(503).json({ success: false, message: "Unable to moderate campaign." });
  }
}

async function listContactMessages(req, res) {
  const parsed = contactListSchema.safeParse(req.query);
  if (!parsed.success) return invalid(res, parsed.error.issues);
  const { status, limit, offset } = parsed.data;
  try {
    const messages = await prisma.contactMessage.findMany({
      where: status ? { status } : {},
      select: { id: true, name: true, email: true, subject: true, message: true, status: true, reviewedAt: true, createdAt: true },
      orderBy: { createdAt: "asc" }, take: limit, skip: offset,
    });
    return res.json({ success: true, data: messages });
  } catch (error) {
    console.error("Admin contact review list failed.", error?.code || "unknown");
    return res.status(503).json({ success: false, message: "Unable to retrieve contact messages." });
  }
}

async function reviewContactMessage(req, res) {
  const parsed = contactReviewSchema.safeParse(req.body);
  if (!parsed.success) return invalid(res, parsed.error.issues);
  try {
    const result = await prisma.$transaction(async (tx) => {
      const current = await tx.contactMessage.findUnique({ where: { id: req.params.id }, select: { id: true, status: true, reviewedAt: true } });
      if (!current) return null;
      const reviewedAt = parsed.data.status === "NEW" ? null : new Date();
      const updated = await tx.contactMessage.update({ where: { id: current.id }, data: { status: parsed.data.status, reviewedAt, reviewedById: reviewedAt ? req.user.id : null }, select: { id: true, status: true, reviewedAt: true, updatedAt: true } });
      await tx.adminAuditLog.create({ data: {
        actorUserId: req.user.id,
        actorLabel: "PLATFORM_ADMIN",
        action: "CONTACT_MESSAGE_REVIEWED",
        entityType: "ContactMessage",
        entityId: current.id,
        before: { status: current.status },
        after: { status: updated.status, reason: parsed.data.reason || null },
      } });
      return updated;
    });
    if (!result) return res.status(404).json({ success: false, message: "Contact message not found." });
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error("Admin contact review failed.", error?.code || "unknown");
    return res.status(503).json({ success: false, message: "Unable to update contact message." });
  }
}

async function listAuditLogs(req, res) {
  const parsed = paginationSchema.safeParse(req.query);
  if (!parsed.success) return invalid(res, parsed.error.issues);
  try {
    const entries = await prisma.adminAuditLog.findMany({
      select: { id: true, actorUserId: true, actorLabel: true, action: true, entityType: true, entityId: true, before: true, after: true, createdAt: true },
      orderBy: { createdAt: "desc" }, take: parsed.data.limit, skip: parsed.data.offset,
    });
    return res.json({ success: true, data: entries });
  } catch (error) {
    console.error("Admin audit log retrieval failed.", error?.code || "unknown");
    return res.status(503).json({ success: false, message: "Unable to retrieve audit history." });
  }
}

async function updatePlatformRole(req, res) {
  const parsed = platformRoleSchema.safeParse(req.body);
  if (!parsed.success) return invalid(res, parsed.error.issues);
  if (req.params.id === req.user.id && parsed.data.platformRole !== "ADMIN") {
    return res.status(409).json({ success: false, message: "An administrator cannot remove their own access." });
  }
  try {
    const result = await prisma.$transaction(async (tx) => {
      const current = await tx.user.findUnique({ where: { id: req.params.id }, select: { id: true, platformRole: true, isActive: true } });
      if (!current || !current.isActive) return null;
      if (current.platformRole === parsed.data.platformRole) return { user: current, unchanged: true };
      const updated = await tx.user.update({ where: { id: current.id }, data: { platformRole: parsed.data.platformRole }, select: { id: true, platformRole: true } });
      await tx.adminAuditLog.create({ data: {
        actorUserId: req.user.id,
        actorLabel: "PLATFORM_ADMIN",
        action: "ADMIN_ROLE_CHANGED",
        entityType: "User",
        entityId: current.id,
        before: { platformRole: current.platformRole },
        after: { platformRole: updated.platformRole, reason: parsed.data.reason },
      } });
      return { user: updated, unchanged: false };
    });
    if (!result) return res.status(404).json({ success: false, message: "Active user not found." });
    return res.json({ success: true, data: result.user, unchanged: result.unchanged });
  } catch (error) {
    console.error("Admin role update failed.", error?.code || "unknown");
    return res.status(503).json({ success: false, message: "Unable to update platform role." });
  }
}

module.exports = { getSummary, listAdminUsers, listOrganizations, moderateOrganization, listCampaigns, moderateCampaign, listContactMessages, reviewContactMessage, listAuditLogs, updatePlatformRole };
