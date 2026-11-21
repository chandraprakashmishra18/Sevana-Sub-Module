const { z } = require("zod");

const organizationStatuses = ["PENDING", "VERIFIED", "REJECTED", "SUSPENDED"];
const campaignStatuses = ["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"];
const contactStatuses = ["NEW", "REVIEWED", "CLOSED"];
const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

const organizationListSchema = paginationSchema.extend({ status: z.enum(organizationStatuses).optional() });
const campaignListSchema = paginationSchema.extend({ status: z.enum(campaignStatuses).optional() });
const contactListSchema = paginationSchema.extend({ status: z.enum(contactStatuses).optional() });
const adminUserListSchema = paginationSchema.extend({ search: z.string().trim().max(100).optional() });
const organizationModerationSchema = z.object({
  status: z.enum(["VERIFIED", "REJECTED", "SUSPENDED"]),
  reason: z.string().trim().min(5).max(1000),
}).strict();
const campaignModerationSchema = z.object({
  status: z.enum(["ACTIVE", "PAUSED", "CANCELLED"]),
  reason: z.string().trim().min(5).max(1000),
}).strict();
const contactReviewSchema = z.object({
  status: z.enum(contactStatuses),
  reason: z.string().trim().min(3).max(1000).optional(),
}).strict();
const platformRoleSchema = z.object({
  platformRole: z.enum(["INDIVIDUAL", "ADMIN"]),
  reason: z.string().trim().min(5).max(1000),
}).strict();

module.exports = {
  paginationSchema,
  organizationListSchema,
  campaignListSchema,
  contactListSchema,
  adminUserListSchema,
  organizationModerationSchema,
  campaignModerationSchema,
  contactReviewSchema,
  platformRoleSchema,
};
