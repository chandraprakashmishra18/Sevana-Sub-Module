const { z } = require("zod");
const feedbackSchema = z.object({ rating: z.coerce.number().int().min(1).max(5), comment: z.string().trim().min(10).max(3000) });
const invitationSchema = z.object({ email: z.string().trim().email().max(255), role: z.enum(["worker", "organizer", "medical", "teacher", "attendee"]).default("worker"), message: z.string().max(2000).optional() });
const invitationStatusSchema = z.object({ status: z.enum(["ACCEPTED", "DECLINED", "REVOKED"]) });
module.exports = { feedbackSchema, invitationSchema, invitationStatusSchema };
