const prisma = require("../config/prisma");
const { contactMessageSchema } = require("../validators/contact.validator");

async function submit(req, res) {
  const parsed = contactMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: "Please check the contact form fields.", errors: parsed.error.issues });
  }
  if (parsed.data.website?.trim()) {
    return res.status(400).json({ success: false, message: "Contact submission rejected." });
  }

  try {
    const message = await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
      },
      select: { id: true, status: true, createdAt: true },
    });
    return res.status(201).json({
      success: true,
      message: "Your message was stored for review. It has not been emailed.",
      data: message,
    });
  } catch (error) {
    console.error("Contact submission persistence failed.", error?.code || "unknown");
    return res.status(503).json({ success: false, message: "Unable to store your message right now." });
  }
}

module.exports = { submit };
