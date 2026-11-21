const { z } = require("zod");
const updateProfileSchema = z.object({ fullName: z.string().trim().min(2).max(120).optional(), phone: z.string().trim().max(20).optional().nullable() }).strict().refine((data) => Object.keys(data).length > 0);
module.exports = { updateProfileSchema };
