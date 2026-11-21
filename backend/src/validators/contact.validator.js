const { z } = require("zod");

const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255).transform((value) => value.toLowerCase()),
  subject: z.string().trim().min(3).max(180),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(500).optional(),
}).strict();

module.exports = { contactMessageSchema };
