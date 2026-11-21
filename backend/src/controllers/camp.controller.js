const prisma = require("../config/prisma");
const { createCampSchema, updateCampSchema, registrationSchema, registrationUpdateSchema } = require("../validators/camp.validator");
const { notifyUser, awardXP } = require("../services/communityEvents");

function validate(schema, body, res) {
  const result = schema.safeParse(body);
  if (!result.success) { res.status(400).json({ success: false, message: "Validation failed.", errors: result.error.issues }); return null; }
  return result.data;
}

function serializeCamp(camp) {
  const active = (camp.registrations || []).filter((item) => item.status === "REGISTERED");
  return { ...camp, organizationName: camp.organization?.name, organizationStatus: camp.organization?.verificationStatus,
    registrationCounts: { total: active.length, volunteers: active.filter((item) => item.role === "VOLUNTEER").length, beneficiaries: active.filter((item) => item.role === "BENEFICIARY").length },
    registrations: undefined, organization: undefined, _count: undefined };
}

async function hasOrganizationAccess(userId, organizationId) {
  const membership = await prisma.organizationMember.findFirst({ where: { userId, organizationId, role: { in: ["OWNER", "ADMIN", "COORDINATOR"] } } });
  return Boolean(membership);
}

async function promoteWaitlisted(tx, campId, capacity) {
  if (!capacity) return null;
  const occupied = await tx.campRegistration.count({ where: { campId, status: "REGISTERED" } });
  if (occupied >= capacity) return null;
  const next = await tx.campRegistration.findFirst({ where: { campId, status: "WAITLISTED" }, orderBy: { registeredAt: "asc" } });
  return next ? tx.campRegistration.update({ where: { id: next.id }, data: { status: "REGISTERED" } }) : null;
}

async function listCamps(req, res) {
  try {
    const where = {};
    const mine = req.mine === true || req.query.mine === "true";
    if (!mine) where.status = { in: ["PUBLISHED", "COMPLETED"] };
    if (req.query.type && ["MEDICAL", "EDUCATIONAL"].includes(req.query.type.toUpperCase())) where.type = req.query.type.toUpperCase();
    if (req.query.city) where.city = { contains: String(req.query.city), mode: "insensitive" };
    if (req.query.search) where.OR = ["title", "description", "city", "venue"].map((field) => ({ [field]: { contains: String(req.query.search), mode: "insensitive" } }));
    if (mine) {
      if (!req.user) return res.status(401).json({ success: false, message: "Authentication required." });
      where.organization = { members: { some: { userId: req.user.id, role: { in: ["OWNER", "ADMIN", "COORDINATOR"] } } } };
    }
    const camps = await prisma.camp.findMany({ where, include: { organization: { select: { name: true, verificationStatus: true } }, registrations: { select: { role: true, status: true } } }, orderBy: { startsAt: "asc" } });
    return res.json({ success: true, data: camps.map(serializeCamp) });
  } catch (error) { console.error("List camps error:", error); return res.status(500).json({ success: false, message: "Unable to retrieve camps." }); }
}

async function getCamp(req, res) {
  try {
    const camp = await prisma.camp.findUnique({ where: { id: req.params.id }, include: { organization: { select: { name: true, verificationStatus: true } }, registrations: { select: { role: true, status: true } } } });
    if (!camp || (!["PUBLISHED", "COMPLETED"].includes(camp.status) && (!req.user || !(await hasOrganizationAccess(req.user.id, camp.organizationId))))) return res.status(404).json({ success: false, message: "Camp not found." });
    return res.json({ success: true, data: serializeCamp(camp) });
  } catch (error) { console.error("Get camp error:", error); return res.status(500).json({ success: false, message: "Unable to retrieve camp." }); }
}

async function createCamp(req, res) {
  const data = validate(createCampSchema, req.body, res); if (!data) return;
  try {
    const membership = await prisma.organizationMember.findFirst({ where: { userId: req.user.id, role: { in: ["OWNER", "ADMIN", "COORDINATOR"] } }, orderBy: { createdAt: "asc" } });
    if (!membership) return res.status(403).json({ success: false, message: "An organization owner or coordinator account is required to create camps." });
    const camp = await prisma.camp.create({ data: { ...data, organizationId: membership.organizationId, createdById: req.user.id }, include: { organization: { select: { name: true, verificationStatus: true } } } });
    return res.status(201).json({ success: true, data: serializeCamp(camp) });
  } catch (error) { console.error("Create camp error:", error); return res.status(500).json({ success: false, message: "Unable to create camp." }); }
}

async function updateCamp(req, res) {
  const data = validate(updateCampSchema, req.body, res); if (!data) return;
  try {
    const existing = await prisma.camp.findUnique({ where: { id: req.params.id }, include: { organization: { select: { verificationStatus: true } } } });
    if (!existing) return res.status(404).json({ success: false, message: "Camp not found." });
    if (!(await hasOrganizationAccess(req.user.id, existing.organizationId))) return res.status(403).json({ success: false, message: "You cannot manage this organization's camp." });
    if (data.status === "PUBLISHED" && existing.organization.verificationStatus !== "VERIFIED") return res.status(403).json({ success: false, message: "Only verified organizations can publish camps." });
    if (data.status === "COMPLETED" && existing.startsAt > new Date()) return res.status(400).json({ success: false, message: "A camp cannot be completed before it begins." });
    if (data.capacity !== undefined && data.capacity !== null) {
      const occupied = await prisma.campRegistration.count({ where: { campId: existing.id, status: "REGISTERED" } });
      if (data.capacity < occupied) return res.status(409).json({ success: false, message: "Capacity cannot be lower than the current confirmed registrations." });
    }
    const camp = await prisma.camp.update({ where: { id: existing.id }, data, include: { organization: { select: { name: true, verificationStatus: true } } } });
    return res.json({ success: true, data: serializeCamp(camp) });
  } catch (error) { console.error("Update camp error:", error); return res.status(500).json({ success: false, message: "Unable to update camp." }); }
}

async function createRegistration(req, res) {
  const data = validate(registrationSchema, req.body, res); if (!data) return;
  try {
    const { camp, registration } = await prisma.$transaction(async (tx) => {
      const currentCamp = await tx.camp.findUnique({ where: { id: req.params.id } });
      if (!currentCamp || currentCamp.status !== "PUBLISHED") throw Object.assign(new Error("CAMP_CLOSED"), { code: "CAMP_CLOSED" });
      if (currentCamp.registrationDeadline && currentCamp.registrationDeadline < new Date()) throw Object.assign(new Error("REGISTRATION_CLOSED"), { code: "REGISTRATION_CLOSED" });
      const existing = await tx.campRegistration.findUnique({ where: { campId_userId: { campId: currentCamp.id, userId: req.user.id } } });
      if (existing && existing.status !== "CANCELLED") throw Object.assign(new Error("ALREADY_REGISTERED"), { code: "ALREADY_REGISTERED", registration: existing });
      const user = await tx.user.findUnique({ where: { id: req.user.id }, select: { fullName: true, email: true, phone: true } });
      const registeredCount = await tx.campRegistration.count({ where: { campId: currentCamp.id, status: "REGISTERED" } });
      const full = currentCamp.capacity !== null && registeredCount >= currentCamp.capacity;
      const registration = existing
        ? await tx.campRegistration.update({ where: { id: existing.id }, data: { ...data, status: full ? "WAITLISTED" : "REGISTERED", attendance: null, registeredAt: new Date() } })
        : await tx.campRegistration.create({ data: { ...data, campId: currentCamp.id, userId: req.user.id, fullName: user.fullName, email: user.email, phone: user.phone, status: full ? "WAITLISTED" : "REGISTERED" } });
      return { camp: currentCamp, registration };
    }, { isolationLevel: "Serializable" });
    await notifyUser(req.user.id, { title: "Camp registration recorded", message: `Your registration is ${registration.status.toLowerCase()}.`, type: "registration", href: `/camps/${camp.id}` });
    const organizers = await prisma.organizationMember.findMany({ where: { organizationId: camp.organizationId, role: { in: ["OWNER", "ADMIN", "COORDINATOR"] }, userId: { not: req.user.id } }, select: { userId: true } });
    await prisma.notification.createMany({ data: organizers.map((member) => ({ userId: member.userId, title: "New camp registration", message: `A participant registered for ${camp.title}.`, type: "registration", href: "/manage-camps" })) });
    return res.status(201).json({ success: true, data: registration });
  } catch (error) {
    if (error.code === "CAMP_CLOSED") return res.status(404).json({ success: false, message: "Camp is not open for registration." });
    if (error.code === "REGISTRATION_CLOSED") return res.status(400).json({ success: false, message: "Registration has closed." });
    if (error.code === "ALREADY_REGISTERED") return res.status(409).json({ success: false, message: "You are already registered for this camp.", data: error.registration });
    if (error.code === "P2002") return res.status(409).json({ success: false, message: "You are already registered for this camp." });
    if (error.code === "P2034") return res.status(409).json({ success: false, message: "Camp capacity changed during registration. Please retry." });
    console.error("Register for camp error:", error); return res.status(500).json({ success: false, message: "Unable to register for camp." });
  }
}

async function listRegistrations(req, res) {
  try {
    const camp = await prisma.camp.findUnique({ where: { id: req.params.id }, select: { id: true, organizationId: true } });
    if (!camp) return res.status(404).json({ success: false, message: "Camp not found." });
    if (!(await hasOrganizationAccess(req.user.id, camp.organizationId))) return res.status(403).json({ success: false, message: "You cannot view these registrations." });
    const registrations = await prisma.campRegistration.findMany({ where: { campId: camp.id }, orderBy: { registeredAt: "desc" } });
    return res.json({ success: true, data: registrations });
  } catch (error) { console.error("List registrations error:", error); return res.status(500).json({ success: false, message: "Unable to retrieve registrations." }); }
}

async function organizationRegistrations(req, res) {
  try {
    const rows = await prisma.campRegistration.findMany({
      where: {
        camp: {
          organization: {
            members: {
              some: { userId: req.user.id, role: { in: ["OWNER", "ADMIN", "COORDINATOR"] } },
            },
          },
        },
      },
      include: { camp: { select: { id: true, title: true } } },
      orderBy: { registeredAt: "desc" },
    });
    return res.json({ success: true, data: rows.map(({ camp, ...registration }) => ({ ...registration, campId: camp.id, campTitle: camp.title })) });
  } catch (error) { console.error("List organization registrations error:", error); return res.status(500).json({ success: false, message: "Unable to retrieve organization registrations." }); }
}

async function updateRegistration(req, res) {
  const data = validate(registrationUpdateSchema, req.body, res); if (!data) return;
  try {
    const registration = await prisma.campRegistration.findUnique({ where: { id: req.params.registrationId }, include: { camp: { select: { organizationId: true, title: true, startsAt: true, status: true } } } });
    if (!registration) return res.status(404).json({ success: false, message: "Registration not found." });
    if (!(await hasOrganizationAccess(req.user.id, registration.camp.organizationId))) return res.status(403).json({ success: false, message: "You cannot manage this registration." });
    if (data.attendance === "PRESENT" && registration.status !== "REGISTERED") return res.status(400).json({ success: false, message: "Only confirmed registrations can be marked present." });
    if (data.attendance === "PRESENT" && (registration.camp.status === "CANCELLED" || registration.camp.startsAt > new Date())) return res.status(400).json({ success: false, message: "Attendance can only be verified on or after a camp begins." });
    if (data.attendance === "PRESENT" && data.status && data.status !== "REGISTERED") return res.status(400).json({ success: false, message: "Attendance can only be recorded for a confirmed registration." });
    const { updated, promoted } = await prisma.$transaction(async (tx) => {
      if (data.status === "REGISTERED" && registration.status !== "REGISTERED") {
        const campForCapacity = await tx.camp.findUnique({ where: { id: registration.campId }, select: { capacity: true } });
        if (campForCapacity.capacity) {
          const occupied = await tx.campRegistration.count({ where: { campId: registration.campId, status: "REGISTERED" } });
          if (occupied >= campForCapacity.capacity) throw Object.assign(new Error("CAMP_FULL"), { code: "CAMP_FULL" });
        }
      }
      const updated = await tx.campRegistration.update({ where: { id: registration.id }, data });
      const camp = data.status === "CANCELLED" || data.status === "WAITLISTED"
        ? await tx.camp.findUnique({ where: { id: registration.campId }, select: { capacity: true } })
        : null;
      const promoted = camp ? await promoteWaitlisted(tx, registration.campId, camp.capacity) : null;
      return { updated, promoted };
    }, { isolationLevel: "Serializable" });
    if (promoted?.userId) await notifyUser(promoted.userId, { title: "Camp place confirmed", message: `Your waitlisted registration for ${registration.camp.title} is now confirmed.`, type: "registration", href: `/camps/${registration.campId}` });
    if (data.attendance === "PRESENT" && registration.status !== "CANCELLED" && registration.userId) {
      const reward = registration.role === "VOLUNTEER" ? 100 : 50;
      await awardXP(registration.userId, "CAMP_ATTENDANCE", registration.id, reward);
      await notifyUser(registration.userId, { title: "Camp attendance verified", message: `Attendance for ${registration.camp.title} was recorded.`, type: "attendance", href: `/camps/${registration.campId}` });
    }
    return res.json({ success: true, data: updated });
  } catch (error) {
    if (error.code === "CAMP_FULL") return res.status(409).json({ success: false, message: "Camp is at capacity. Keep this registration waitlisted." });
    if (error.code === "P2034") return res.status(409).json({ success: false, message: "Camp capacity changed. Please retry." });
    console.error("Update registration error:", error); return res.status(500).json({ success: false, message: "Unable to update registration." });
  }
}

async function myRegistrations(req, res) {
  try {
    const rows = await prisma.campRegistration.findMany({ where: { userId: req.user.id }, include: { camp: { select: { id: true, title: true, startsAt: true, status: true, organization: { select: { name: true } } } } }, orderBy: { registeredAt: "desc" } });
    return res.json({ success: true, data: rows });
  } catch (error) { console.error("My registrations error:", error); return res.status(500).json({ success: false, message: "Unable to retrieve your registrations." }); }
}

async function cancelMyRegistration(req, res) {
  try {
    const registration = await prisma.campRegistration.findUnique({ where: { campId_userId: { campId: req.params.id, userId: req.user.id } }, include: { camp: { select: { capacity: true, startsAt: true, status: true } } } });
    if (!registration) return res.status(404).json({ success: false, message: "Your registration was not found." });
    if (registration.status === "CANCELLED") return res.json({ success: true, data: registration });
    if (registration.camp.startsAt <= new Date() && registration.camp.status !== "CANCELLED") return res.status(400).json({ success: false, message: "Registration cannot be cancelled after a camp begins." });
    const { updated, promoted } = await prisma.$transaction(async (tx) => {
      const updated = await tx.campRegistration.update({ where: { id: registration.id }, data: { status: "CANCELLED" } });
      const promoted = await promoteWaitlisted(tx, registration.campId, registration.camp.capacity);
      return { updated, promoted };
    });
    if (promoted?.userId) await notifyUser(promoted.userId, { title: "Camp place confirmed", message: `Your waitlisted registration is now confirmed.`, type: "registration", href: `/camps/${registration.campId}` });
    return res.json({ success: true, data: updated });
  } catch (error) { console.error("Cancel camp registration error:", error); return res.status(500).json({ success: false, message: "Unable to cancel registration." }); }
}

module.exports = { listCamps, getCamp, createCamp, updateCamp, createRegistration, listRegistrations, organizationRegistrations, updateRegistration, myRegistrations, cancelMyRegistration };
