const { z } = require("zod");

const campFields = {
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10),
  type: z.enum(["MEDICAL", "EDUCATIONAL"]),
  serviceDetails: z.string().optional(),
  targetAudience: z.string().optional(),
  venue: z.string().max(200).optional(),
  address: z.string().optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  registrationDeadline: z.coerce.date().optional(),
  capacity: z.number().int().positive().optional(),
};
const createCampSchema = z.object(campFields).refine((data) => data.endsAt > data.startsAt, { path: ["endsAt"], message: "End time must be after start time." });

const updateCampSchema = z.object({ ...Object.fromEntries(Object.entries(campFields).map(([key, schema]) => [key, schema.optional()])), status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"]).optional() }).refine((data) => !data.startsAt || !data.endsAt || data.endsAt > data.startsAt, { path: ["endsAt"], message: "End time must be after start time." });
const registrationSchema = z.object({ role: z.enum(["BENEFICIARY", "VOLUNTEER"]).default("BENEFICIARY"), notes: z.string().max(2000).optional() });
const registrationUpdateSchema = z.object({ status: z.enum(["REGISTERED", "WAITLISTED", "CANCELLED"]).optional(), attendance: z.enum(["PRESENT", "ABSENT", "EXCUSED"]).nullable().optional() }).refine((data) => data.status !== undefined || data.attendance !== undefined);

module.exports = { createCampSchema, updateCampSchema, registrationSchema, registrationUpdateSchema };
