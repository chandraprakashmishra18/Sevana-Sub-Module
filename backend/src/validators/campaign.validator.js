const { z } = require("zod");
const categories = ["STUDENT_SPONSORSHIP", "MEDICAL_AID", "FOOD_SUPPORT", "CLOTHING_SUPPORT", "EMERGENCY_RELIEF", "EDUCATION", "HEALTH", "OTHER"];
const beneficiaries = ["GENERAL", "CHILDREN", "WOMEN", "ELDERLY", "PERSONS_WITH_DISABILITIES", "STUDENTS", "FAMILIES"];
const fields = {
  title: z.string().trim().min(3).max(200), description: z.string().trim().min(20),
  category: z.enum(categories), beneficiaryGroup: z.enum(beneficiaries).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")), goalAmount: z.coerce.number().positive().max(100000000).optional(),
  startDate: z.coerce.date().optional(), endDate: z.coerce.date().optional(), location: z.string().max(2000).optional(),
};
const createCampaignSchema = z.object(fields).refine((v) => !v.startDate || !v.endDate || v.endDate > v.startDate, { path: ["endDate"], message: "End date must be after start date." });
const updateCampaignSchema = z.object({ ...Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v.optional()])), status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"]).optional() }).refine((v) => !v.startDate || !v.endDate || v.endDate > v.startDate, { path: ["endDate"], message: "End date must be after start date." });
const donationIntentSchema = z.object({ campaignId: z.string().uuid().optional(), amount: z.coerce.number().positive().max(1000000), anonymous: z.boolean().default(false) });
module.exports = { createCampaignSchema, updateCampaignSchema, donationIntentSchema };
