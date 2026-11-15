
const { z } = require("zod");

// Exact Prisma enum values
const campaignCategories = [
  "STUDENT_SPONSORSHIP",
  "MEDICAL_AID",
  "FOOD_SUPPORT",
  "CLOTHING_SUPPORT",
  "EMERGENCY_RELIEF",
  "EDUCATION",
  "HEALTH",
  "OTHER",
];

const beneficiaryGroups = [
  "GENERAL",
  "CHILDREN",
  "WOMEN",
  "ELDERLY",
  "PERSONS_WITH_DISABILITIES",
  "STUDENTS",
  "FAMILIES",
];

const campaignStatuses = [
  "DRAFT",
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
  "CANCELLED",
];

// Reusable campaign fields
const campaignFields = {
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10),
  category: z.enum(campaignCategories),
  beneficiaryGroup: z.enum(beneficiaryGroups).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  goalAmount: z.coerce.number().positive().max(9999999999.99).optional(),
  currency: z.string().length(3).default("INR"),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  location: z.string().trim().max(500).optional(),
};

// Create campaign validation
const createCampaignSchema = z.object(campaignFields).superRefine(
  (data, ctx) => {
    if (
      data.startDate &&
      data.endDate &&
      data.endDate <= data.startDate
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be after start date.",
      });
    }
  }
);

// Update campaign validation
const updateCampaignSchema = z.object({
  title: campaignFields.title.optional(),
  description: campaignFields.description.optional(),
  category: campaignFields.category.optional(),
  beneficiaryGroup: campaignFields.beneficiaryGroup,
  imageUrl: campaignFields.imageUrl,
  goalAmount: campaignFields.goalAmount,
  currency: campaignFields.currency.optional(),
  startDate: campaignFields.startDate,
  endDate: campaignFields.endDate,
  location: campaignFields.location,
}).partial().superRefine((data, ctx) => {
  if (
    data.startDate &&
    data.endDate &&
    data.endDate <= data.startDate
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["endDate"],
      message: "End date must be after start date.",
    });
  }

  if (Object.keys(data).length === 0) {
    ctx.addIssue({
      code: "custom",
      message: "At least one field is required for an update.",
    });
  }
});

// Campaign status validation
const updateCampaignStatusSchema = z.object({
  status: z.enum(campaignStatuses),
});

module.exports = {
  createCampaignSchema,
  updateCampaignSchema,
  updateCampaignStatusSchema,
};
