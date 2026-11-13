
const { z } = require("zod");

const organizationTypes = [
  "NGO",
  "SCHOOL",
  "COLLEGE",
  "NSS",
  "NCC",
  "COMPANY",
  "COMMUNITY_GROUP",
  "OTHER",
];

const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255).transform(v => v.toLowerCase()),
  password: z.string().min(8).max(72),
  phone: z.string().trim().max(20).optional(),

  accountType: z.enum(["INDIVIDUAL", "ORGANIZATION"]).default("INDIVIDUAL"),

  organizationName: z.string().trim().max(180).optional(),
  organizationType: z.enum(organizationTypes).optional(),
  organizationDescription: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.accountType === "ORGANIZATION") {
    if (!data.organizationName) {
      ctx.addIssue({
        code: "custom",
        path: ["organizationName"],
        message: "Organization name is required.",
      });
    }

    if (!data.organizationType) {
      ctx.addIssue({
        code: "custom",
        path: ["organizationType"],
        message: "Organization type is required.",
      });
    }
  }
});

const loginSchema = z.object({
  email: z.string().trim().email().transform(v => v.toLowerCase()),
  password: z.string().min(1),
});

module.exports = { registerSchema, loginSchema };