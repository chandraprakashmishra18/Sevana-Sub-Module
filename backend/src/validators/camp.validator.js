
const { z } = require("zod");

// -----------------------------------------------------
// ENUMS
// -----------------------------------------------------

const campTypes = ["MEDICAL", "EDUCATIONAL"];

const registrationRoles = ["BENEFICIARY", "VOLUNTEER"];

const registrationStatuses = [
  "REGISTERED",
  "WAITLISTED",
  "CANCELLED"
];

const attendanceStatuses = [
  "PRESENT",
  "ABSENT",
  "EXCUSED"
];

// -----------------------------------------------------
// SHARED DATE VALIDATION
// -----------------------------------------------------

const dateField = z.coerce.date();

// -----------------------------------------------------
// CREATE CAMP VALIDATOR
// -----------------------------------------------------

const createCampSchema = z.object({
  organizationId: z.string().uuid(),

  title: z.string().trim().min(3).max(200),

  description: z.string().trim().min(10),

  type: z.enum(campTypes),

  serviceDetails: z.string().optional(),

  targetAudience: z.string().optional(),

  venue: z.string().trim().max(200).optional(),

  address: z.string().optional(),

  city: z.string().trim().max(100).optional(),

  state: z.string().trim().max(100).optional(),

  latitude: z.number().min(-90).max(90).optional(),

  longitude: z.number().min(-180).max(180).optional(),

  startsAt: dateField,

  endsAt: dateField,

  registrationDeadline: dateField.optional(),

  capacity: z.number().int().positive().optional()
}).refine(
  (data) => data.endsAt > data.startsAt,
  {
    message: "End date must be after start date.",
    path: ["endsAt"]
  }
).refine(
  (data) =>
    !data.registrationDeadline ||
    data.registrationDeadline <= data.startsAt,
  {
    message: "Registration deadline must be on or before the camp start date.",
    path: ["registrationDeadline"]
  }
);

// -----------------------------------------------------
// UPDATE CAMP VALIDATOR
// -----------------------------------------------------

const updateCampSchema = z.object({
  title: z.string().trim().min(3).max(200).optional(),

  description: z.string().trim().min(10).optional(),

  type: z.enum(campTypes).optional(),

  serviceDetails: z.string().optional(),

  targetAudience: z.string().optional(),

  venue: z.string().trim().max(200).optional(),

  address: z.string().optional(),

  city: z.string().trim().max(100).optional(),

  state: z.string().trim().max(100).optional(),

  latitude: z.number().min(-90).max(90).nullable().optional(),

  longitude: z.number().min(-180).max(180).nullable().optional(),

  startsAt: dateField.optional(),

  endsAt: dateField.optional(),

  registrationDeadline: dateField.nullable().optional(),

  capacity: z.number().int().positive().nullable().optional()
}).strict().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided."
  }
);

// -----------------------------------------------------
// CAMP REGISTRATION VALIDATOR
// -----------------------------------------------------

const registerForCampSchema = z.object({
  fullName: z.string().trim().min(2).max(120),

  email: z.string().trim().email().max(255).optional(),

  phone: z.string().trim().min(7).max(20).optional(),

  role: z.enum(registrationRoles).default("BENEFICIARY")
}).refine(
  (data) => data.email || data.phone,
  {
    message: "Email or phone number is required."
  }
);

// -----------------------------------------------------
// REGISTRATION UPDATE VALIDATOR
// -----------------------------------------------------

const updateRegistrationSchema = z.object({
  status: z.enum(registrationStatuses).optional(),

  attendance: z.enum(attendanceStatuses).nullable().optional(),

  notes: z.string().optional()
}).strict().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided."
  }
);

// -----------------------------------------------------
// CAMP OUTCOME VALIDATOR
// -----------------------------------------------------

const campOutcomeSchema = z.object({
  summary: z.string().trim().min(10),

  beneficiariesServed: z.number().int().min(0).default(0),

  volunteersParticipated: z.number().int().min(0).default(0),

  servicesProvided: z.string().optional(),

  materialsDistributed: z.string().optional()
});

const attendanceSchema = z.object({
  attendance: z.enum(["PRESENT", "ABSENT", "EXCUSED"])
}).strict();

// -----------------------------------------------------
// EXPORTS
// -----------------------------------------------------

module.exports = {
  createCampSchema,
  updateCampSchema,
  registerForCampSchema,
  updateRegistrationSchema,
  campOutcomeSchema,
  attendanceSchema
};
