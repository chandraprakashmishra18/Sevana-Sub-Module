
const { z } = require("zod");
const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

const {
  createCampaignSchema,
  updateCampaignSchema,
  updateCampaignStatusSchema
} = require("../validators/campaign.validator");

const MANAGER_ROLES = ["OWNER", "ADMIN", "COORDINATOR"];

async function checkManager(userId, organizationId) {
  const membership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: { organizationId, userId }
    },
    include: {
      organization: {
        select: { verificationStatus: true }
      }
    }
  });

  if (!membership || !MANAGER_ROLES.includes(membership.role)) {
    return { allowed: false, message: "Organization manager permission required." };
  }

  if (["REJECTED", "SUSPENDED"].includes(membership.organization.verificationStatus)) {
    return { allowed: false, message: "Organization is not permitted to operate." };
  }

  return { allowed: true };
}

// CAMPAIGNS

const createCampaign = asyncHandler(async (req, res) => {
  const organizationId = req.body.organizationId;
  const validation = createCampaignSchema.safeParse(req.body);

  if (!organizationId || !validation.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid campaign details.",
      errors: validation.success ? undefined : validation.error.flatten()
    });
  }

  const permission = await checkManager(req.user.id, organizationId);
  if (!permission.allowed) {
    return res.status(403).json({ success: false, message: permission.message });
  }

  const campaign = await prisma.campaign.create({
    data: {
      ...validation.data,
      organizationId,
      createdById: req.user.id,
      status: "DRAFT"
    }
  });

  res.status(201).json({ success: true, message: "Campaign created.", data: campaign });
});

const getCampaigns = asyncHandler(async (req, res) => {
  const where = req.query.mine === "true" && req.user
    ? {
        organization: {
          members: { some: { userId: req.user.id } }
        }
      }
    : { status: "ACTIVE" };

  const campaigns = await prisma.campaign.findMany({
    where,
    include: {
      organization: { select: { id: true, name: true } },
      _count: { select: { donations: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  res.json({ success: true, count: campaigns.length, data: campaigns });
});

const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await prisma.campaign.findUnique({
    where: { id: req.params.campaignId },
    include: {
      organization: { select: { id: true, name: true } },
      donations: { where: { status: "SUCCESSFUL" } }
    }
  });

  if (!campaign) {
    return res.status(404).json({ success: false, message: "Campaign not found." });
  }

  res.json({ success: true, data: campaign });
});

const updateCampaign = asyncHandler(async (req, res) => {
  const validation = updateCampaignSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ success: false, errors: validation.error.flatten() });
  }

  const campaign = await prisma.campaign.findUnique({
    where: { id: req.params.campaignId },
    select: { id: true, organizationId: true }
  });

  if (!campaign) {
    return res.status(404).json({ success: false, message: "Campaign not found." });
  }

  const permission = await checkManager(req.user.id, campaign.organizationId);
  if (!permission.allowed) {
    return res.status(403).json({ success: false, message: permission.message });
  }

  const updated = await prisma.campaign.update({
    where: { id: campaign.id },
    data: validation.data
  });

  res.json({ success: true, message: "Campaign updated.", data: updated });
});

const updateCampaignStatus = asyncHandler(async (req, res) => {
  const validation = updateCampaignStatusSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ success: false, errors: validation.error.flatten() });
  }

  const campaign = await prisma.campaign.findUnique({
    where: { id: req.params.campaignId },
    select: { id: true, organizationId: true, status: true }
  });

  if (!campaign) {
    return res.status(404).json({ success: false, message: "Campaign not found." });
  }

  const permission = await checkManager(req.user.id, campaign.organizationId);
  if (!permission.allowed) {
    return res.status(403).json({ success: false, message: permission.message });
  }

  const allowedTransitions = {
    DRAFT: ["ACTIVE", "CANCELLED"],
    ACTIVE: ["PAUSED", "COMPLETED", "CANCELLED"],
    PAUSED: ["ACTIVE", "CANCELLED"],
    COMPLETED: [],
    CANCELLED: []
  };

  if (!allowedTransitions[campaign.status]?.includes(validation.data.status)) {
    return res.status(400).json({
      success: false,
      message: `Cannot change campaign from ${campaign.status} to ${validation.data.status}.`
    });
  }

  const updated = await prisma.campaign.update({
    where: { id: campaign.id },
    data: { status: validation.data.status }
  });

  res.json({ success: true, message: "Campaign status updated.", data: updated });
});

// DONATIONS

const createDonation = asyncHandler(async (req, res) => {
  const schema = z.object({
    campaignId: z.string().uuid().optional(),
    donorName: z.string().trim().min(2).max(120).optional(),
    donorEmail: z.string().email().optional(),
    type: z.enum(["MONEY", "GOODS", "SERVICES"]),
    amount: z.coerce.number().positive().optional(),
    currency: z.string().length(3).default("INR"),
    itemDescription: z.string().trim().min(2).optional(),
    quantity: z.coerce.number().positive().optional(),
    isAnonymous: z.boolean().default(false)
  }).superRefine((data, ctx) => {
    if (data.type === "MONEY" && !data.amount) {
      ctx.addIssue({ code: "custom", path: ["amount"], message: "Amount is required for money donations." });
    }
    if (data.type !== "MONEY" && !data.itemDescription) {
      ctx.addIssue({ code: "custom", path: ["itemDescription"], message: "Item description is required." });
    }
  });

  const validation = schema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ success: false, errors: validation.error.flatten() });
  }

  const data = validation.data;

  if (data.campaignId) {
    const campaign = await prisma.campaign.findUnique({ where: { id: data.campaignId } });
    if (!campaign || campaign.status !== "ACTIVE") {
      return res.status(400).json({ success: false, message: "Campaign is not available for donations." });
    }
  }

  const donation = await prisma.donation.create({
    data: {
      campaignId: data.campaignId,
      donorUserId: req.user?.id,
      donorName: data.isAnonymous ? "Anonymous" : data.donorName,
      donorEmail: data.donorEmail,
      type: data.type,
      amount: data.amount,
      currency: data.currency,
      itemDescription: data.itemDescription,
      quantity: data.quantity,
      isAnonymous: data.isAnonymous,
      status: "PENDING",
      transactions: data.type === "MONEY" ? {
        create: {
          amount: data.amount,
          currency: data.currency,
          status: "PENDING",
          provider: "MANUAL"
        }
      } : undefined
    },
    include: { transactions: true }
  });

  res.status(201).json({
    success: true,
    message: "Donation recorded. Payment is pending confirmation where applicable.",
    data: donation
  });
});

const getDonations = asyncHandler(async (req, res) => {
  const donations = await prisma.donation.findMany({
    where: req.query.mine === "true"
      ? { donorUserId: req.user.id }
      : {},
    include: {
      campaign: { select: { id: true, title: true } },
      transactions: true
    },
    orderBy: { createdAt: "desc" }
  });

  res.json({ success: true, count: donations.length, data: donations });
});

// Only an authorized organization manager can confirm a donation.
// Call this after verifying payment externally.
const confirmDonation = asyncHandler(async (req, res) => {
  const donation = await prisma.donation.findUnique({
    where: { id: req.params.donationId },
    include: { campaign: { select: { organizationId: true } }, transactions: true }
  });

  if (!donation) {
    return res.status(404).json({ success: false, message: "Donation not found." });
  }

  if (!donation.campaign) {
    return res.status(400).json({ success: false, message: "This donation is not linked to a campaign." });
  }

  const permission = await checkManager(req.user.id, donation.campaign.organizationId);
  if (!permission.allowed) {
    return res.status(403).json({ success: false, message: permission.message });
  }

  if (donation.status === "SUCCESSFUL") {
    return res.status(409).json({ success: false, message: "Donation is already confirmed." });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.donation.update({
      where: { id: donation.id },
      data: { status: "SUCCESSFUL" }
    });

    await tx.paymentTransaction.updateMany({
      where: { donationId: donation.id },
      data: { status: "SUCCESSFUL" }
    });

    return result;
  });

  res.json({ success: true, message: "Donation marked successful.", data: updated });
});

// AID REQUESTS

const createAidRequest = asyncHandler(async (req, res) => {
  const schema = z.object({
    organizationId: z.string().uuid(),
    title: z.string().trim().min(3).max(200),
    description: z.string().trim().min(10),
    category: z.enum([
      "STUDENT_SPONSORSHIP",
      "MEDICAL_AID",
      "FOOD_SUPPORT",
      "CLOTHING_SUPPORT",
      "EMERGENCY_RELIEF",
      "EDUCATION",
      "HEALTH",
      "OTHER"
    ]),
    beneficiaryName: z.string().optional(),
    beneficiaryCount: z.coerce.number().int().positive().default(1),
    requestedAmount: z.coerce.number().positive().optional(),
    itemDescription: z.string().optional(),
    quantity: z.coerce.number().positive().optional(),
    unit: z.string().optional(),
    urgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM")
  });

  const validation = schema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ success: false, errors: validation.error.flatten() });
  }

  const organization = await prisma.organization.findUnique({
    where: { id: validation.data.organizationId },
    select: { id: true, verificationStatus: true }
  });

  if (!organization || ["REJECTED", "SUSPENDED"].includes(organization.verificationStatus)) {
    return res.status(400).json({ success: false, message: "Organization is not available." });
  }

  const request = await prisma.aidRequest.create({
    data: { ...validation.data, requesterId: req.user.id }
  });

  res.status(201).json({ success: true, message: "Aid request submitted.", data: request });
});

const getAidRequests = asyncHandler(async (req, res) => {
  const where = req.query.organizationId
    ? { organizationId: req.query.organizationId }
    : { requesterId: req.user.id };

  if (req.query.organizationId) {
    const permission = await checkManager(
      req.user.id,
      req.query.organizationId
    );

    if (!permission.allowed) {
      return res.status(403).json({
        success: false,
        message: permission.message
      });
    }
  }

  const requests = await prisma.aidRequest.findMany({
    where,
    include: {
      organization: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  res.json({ success: true, count: requests.length, data: requests });
});

const reviewAidRequest = asyncHandler(async (req, res) => {
  const schema = z.object({
    status: z.enum(["UNDER_REVIEW", "APPROVED", "REJECTED", "FULFILLED"]),
    reviewNotes: z.string().optional()
  });

  const validation = schema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ success: false, errors: validation.error.flatten() });
  }

  const request = await prisma.aidRequest.findUnique({
    where: { id: req.params.requestId },
    select: { id: true, organizationId: true, status: true }
  });

  if (!request) {
    return res.status(404).json({ success: false, message: "Aid request not found." });
  }

  const permission = await checkManager(req.user.id, request.organizationId);
  if (!permission.allowed) {
    return res.status(403).json({ success: false, message: permission.message });
  }

  const allowedTransitions = {
    SUBMITTED: ["UNDER_REVIEW"],
    UNDER_REVIEW: ["APPROVED", "REJECTED"],
    APPROVED: ["FULFILLED"],
    REJECTED: [],
    FULFILLED: []
  };

  if (!allowedTransitions[request.status]?.includes(validation.data.status)) {
    return res.status(400).json({
      success: false,
      message: `Cannot change aid request from ${request.status} to ${validation.data.status}.`
    });
  }

  const updated = await prisma.aidRequest.update({
    where: { id: request.id },
    data: {
      status: validation.data.status,
      reviewNotes: validation.data.reviewNotes,
      fulfilledAt: validation.data.status === "FULFILLED" ? new Date() : undefined
    }
  });

  res.json({ success: true, message: "Aid request reviewed.", data: updated });
});

// AID DISTRIBUTIONS

const createDistribution = asyncHandler(async (req, res) => {
  const schema = z.object({
    organizationId: z.string().uuid(),
    aidRequestId: z.string().uuid(),
    campaignId: z.string().uuid().optional(),
    donationId: z.string().uuid().optional(),
    amount: z.coerce.number().positive().optional(),
    currency: z.string().length(3).default("INR"),
    itemDescription: z.string().optional(),
    quantity: z.coerce.number().positive().optional(),
    notes: z.string().optional()
  });

  const validation = schema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ success: false, errors: validation.error.flatten() });
  }

  const data = validation.data;
  const permission = await checkManager(req.user.id, data.organizationId);
  if (!permission.allowed) {
    return res.status(403).json({ success: false, message: permission.message });
  }

  const aidRequest = await prisma.aidRequest.findUnique({
    where: { id: data.aidRequestId }
  });

  if (!aidRequest || aidRequest.organizationId !== data.organizationId) {
    return res.status(400).json({ success: false, message: "Aid request does not belong to this organization." });
  }

  if (aidRequest.status !== "APPROVED") {
    return res.status(400).json({ success: false, message: "Only approved aid requests can receive distributions." });
  }

  if (data.campaignId) {
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: data.campaignId,
        organizationId: data.organizationId
      }
    });

    if (!campaign) {
      return res.status(400).json({
        success: false,
        message: "Campaign does not belong to this organization."
      });
    }
  }

  if (data.donationId) {
    const donation = await prisma.donation.findFirst({
      where: {
        id: data.donationId,
        campaign: {
          organizationId: data.organizationId
        }
      }
    });

    if (!donation) {
      return res.status(400).json({
        success: false,
        message: "Donation is not linked to this organization's campaign."
      });
    }
  }

  const distribution = await prisma.aidDistribution.create({
    data: {
      ...data,
      distributedAt: new Date()
    }
  });

  res.status(201).json({ success: true, message: "Aid distribution recorded.", data: distribution });
});

const getDistributions = asyncHandler(async (req, res) => {
  const organizationId = req.query.organizationId;

  if (!organizationId) {
    return res.status(400).json({
      success: false,
      message: "organizationId is required."
    });
  }

  const permission = await checkManager(req.user.id, organizationId);

  if (!permission.allowed) {
    return res.status(403).json({
      success: false,
      message: permission.message
    });
  }

  const distributions = await prisma.aidDistribution.findMany({
    where: { organizationId },
    include: {
      aidRequest: {
        select: { id: true, title: true, status: true }
      },
      campaign: {
        select: { id: true, title: true }
      }
    },
    orderBy: { distributedAt: "desc" }
  });

  return res.json({
    success: true,
    count: distributions.length,
    data: distributions
  });
});

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  updateCampaignStatus,
  createDonation,
  getDonations,
  confirmDonation,
  createAidRequest,
  getAidRequests,
  reviewAidRequest,
  createDistribution,
  getDistributions
};
