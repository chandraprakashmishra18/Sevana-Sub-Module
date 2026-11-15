// NGO-side service layer (mock, localStorage).
// Every function is async-friendly and returns { ok, ... } so that, once the backend contract
// is confirmed, only the bodies in THIS file need to change (components stay untouched).
// Ownership checks here are a UX/demo stand-in - the real backend must enforce authorization.
import { getAllCamps, getCampById, getCampRaw, updateCamp } from "./campService";
import { addNotification } from "./notificationService";
import {
  readRegistrations,
  writeRegistrations,
  normalizeRegistration,
  holdsSlot,
} from "../utils/registrationModel";

const OUTCOME_KEY = "sevana_camp_outcomes";

// Demo status -> database CampStatus (for the future API adapter).
export const DB_STATUS = {
  draft: "DRAFT",
  upcoming: "PUBLISHED",
  ongoing: "PUBLISHED",
  past: "COMPLETED",
  cancelled: "CANCELLED",
};

export const STATUS_LABEL = {
  draft: "Draft",
  upcoming: "Published",
  ongoing: "Ongoing",
  past: "Completed",
  cancelled: "Cancelled",
};

const TRANSITIONS = {
  draft: { publish: "upcoming", cancel: "cancelled" },
  upcoming: { unpublish: "draft", start: "ongoing", complete: "past", cancel: "cancelled" },
  ongoing: { complete: "past", cancel: "cancelled" },
  past: {},
  cancelled: {},
};

export const ACTION_LABEL = {
  publish: "Publish",
  unpublish: "Move to draft",
  start: "Start camp",
  complete: "Mark completed",
  cancel: "Cancel camp",
};

export const allowedActions = (status) => Object.keys(TRANSITIONS[status] || {});

export function canManageCamp(user, camp) {
  if (!user || !camp || user.roleType !== "organizer") return false;
  return camp.organizerId === user.id || (Boolean(user.organization) && camp.organizer === user.organization);
}

function guardOwnership(user, camp) {
  if (!camp) return { ok: false, error: "Camp not found." };
  if (!canManageCamp(user, camp)) {
    return { ok: false, error: "You can only manage camps created by your organization." };
  }
  return null;
}

function readOutcomes() {
  try {
    return JSON.parse(localStorage.getItem(OUTCOME_KEY) || "{}");
  } catch {
    return {};
  }
}

function campStats(camp, allRegistrations) {
  const mine = allRegistrations.filter((r) => r.campId === camp.id).map(normalizeRegistration);
  const registered = mine.filter((r) => r.status === "REGISTERED");
  return {
    registrations: registered.length,
    volunteers: registered.filter((r) => r.role === "VOLUNTEER").length,
    beneficiaries: registered.filter((r) => r.role === "BENEFICIARY").length,
    waitlisted: mine.filter((r) => r.status === "WAITLISTED").length,
    present: registered.filter((r) => r.attendance === "PRESENT").length,
  };
}

export async function listOrgCamps(user) {
  const regs = readRegistrations();
  return (await getAllCamps())
    .filter((camp) => canManageCamp(user, camp))
    .map((camp) => ({ ...camp, stats: campStats(camp, regs) }));
}

export function summarize(camps) {
  const count = (...statuses) => camps.filter((c) => statuses.includes(c.status)).length;
  const sum = (key) => camps.reduce((total, c) => total + c.stats[key], 0);
  return {
    total: camps.length,
    drafts: count("draft"),
    published: count("upcoming", "ongoing"),
    completed: count("past"),
    registrations: sum("registrations"),
    volunteers: sum("volunteers"),
    beneficiaries: sum("beneficiaries"),
    present: sum("present"),
  };
}

export async function getManagedCamp(user, id) {
  const camp = await getCampById(id);
  const blocked = guardOwnership(user, camp);
  if (blocked) return blocked;
  const all = readRegistrations();
  return {
    ok: true,
    camp,
    registrations: all.filter((r) => r.campId === id).map(normalizeRegistration),
    stats: campStats(camp, all),
    outcome: readOutcomes()[id] || null,
  };
}

export async function changeCampStatus(user, id, action) {
  const camp = await getCampById(id);
  const blocked = guardOwnership(user, camp);
  if (blocked) return blocked;

  const next = TRANSITIONS[camp.status]?.[action];
  if (!next) {
    return { ok: false, error: `That action is not available while the camp is ${STATUS_LABEL[camp.status].toLowerCase()}.` };
  }

  const holding = readRegistrations().filter((r) => r.campId === id && holdsSlot(r)).length;
  if (action === "unpublish" && holding > 0) {
    return { ok: false, error: "This camp already has registrations. Cancel it instead of moving it to draft." };
  }

  updateCamp({ id, status: next });
  if (action === "cancel" && holding > 0) {
    addNotification({
      title: "Camp cancelled",
      message: `"${camp.title}" was cancelled by the organizer. ${holding} registration(s) are affected.`,
      type: "camp",
      href: "/my-registrations",
    });
  }
  return { ok: true, status: next };
}

export async function editCamp(user, id, fields) {
  const camp = await getCampById(id);
  const blocked = guardOwnership(user, camp);
  if (blocked) return blocked;
  if (camp.status === "past" || camp.status === "cancelled") {
    return { ok: false, error: "Completed or cancelled camps can't be edited." };
  }

  const title = String(fields.title || "").trim();
  const description = String(fields.description || "").trim();
  const workerTotal = Number(fields.workerTotal);
  const attendeeTotal = Number(fields.attendeeTotal);
  if (title.length < 3) return { ok: false, error: "Title must be at least 3 characters." };
  if (!description) return { ok: false, error: "Description is required." };
  if (!fields.date) return { ok: false, error: "Date is required." };
  if (![workerTotal, attendeeTotal].every((n) => Number.isInteger(n) && n >= 0)) {
    return { ok: false, error: "Slots must be whole numbers (0 or more)." };
  }
  if (workerTotal < (camp.workerSlots?.filled || 0)) {
    return { ok: false, error: `Volunteer slots can't be lower than the ${camp.workerSlots.filled} already filled.` };
  }
  if (attendeeTotal < (camp.attendeeSlots?.filled || 0)) {
    return { ok: false, error: `Beneficiary slots can't be lower than the ${camp.attendeeSlots.filled} already filled.` };
  }

  const raw = getCampRaw(id);
  updateCamp({
    id,
    title,
    description,
    date: fields.date,
    time: String(fields.time || "").trim(),
    location: String(fields.location || "").trim(),
    workerSlots: { filled: raw.workerSlots?.filled || 0, ...raw.workerSlots, total: workerTotal },
    attendeeSlots: { filled: raw.attendeeSlots?.filled || 0, ...raw.attendeeSlots, total: attendeeTotal },
  });
  return { ok: true };
}

export async function setRegistrationStatus(user, registrationId, status) {
  if (!["REGISTERED", "WAITLISTED", "CANCELLED"].includes(status)) {
    return { ok: false, error: "Unknown registration status." };
  }
  const list = readRegistrations();
  const item = list.find((r) => r.id === registrationId);
  if (!item) return { ok: false, error: "Registration not found." };

  const camp = await getCampById(item.campId);
  const blocked = guardOwnership(user, camp);
  if (blocked) return blocked;
  if (camp.status === "past" || camp.status === "cancelled") {
    return { ok: false, error: "This camp is closed, so registrations can't be changed." };
  }

  const current = normalizeRegistration(item);
  if (status === "REGISTERED" && current.status !== "REGISTERED") {
    const slots = current.role === "VOLUNTEER" ? camp.workerSlots : camp.attendeeSlots;
    if (slots && slots.filled >= slots.total) {
      return { ok: false, error: "No free slots for this role. Increase the slots first." };
    }
  }

  item.status = status;
  if (status === "CANCELLED") {
    item.attendance = null;
    item.attended = false;
  }
  writeRegistrations(list);
  return { ok: true };
}

export async function setAttendance(user, registrationId, attendance) {
  if (attendance !== null && !["PRESENT", "ABSENT", "EXCUSED"].includes(attendance)) {
    return { ok: false, error: "Unknown attendance value." };
  }
  const list = readRegistrations();
  const item = list.find((r) => r.id === registrationId);
  if (!item) return { ok: false, error: "Registration not found." };

  const camp = await getCampById(item.campId);
  const blocked = guardOwnership(user, camp);
  if (blocked) return blocked;
  if (camp.status === "draft" || camp.status === "cancelled") {
    return { ok: false, error: "Attendance can only be marked for published camps." };
  }
  if (normalizeRegistration(item).status !== "REGISTERED") {
    return { ok: false, error: "Attendance can only be marked for registered participants." };
  }

  item.attendance = attendance;
  item.attended = attendance === "PRESENT";
  writeRegistrations(list);
  return { ok: true };
}

export async function saveOutcome(user, campId, data) {
  const camp = await getCampById(campId);
  const blocked = guardOwnership(user, camp);
  if (blocked) return blocked;
  if (camp.status !== "past") return { ok: false, error: "Mark the camp as completed before recording its outcome." };

  const summary = String(data.summary || "").trim();
  const served = Number(data.beneficiariesServed);
  const volunteers = Number(data.volunteersParticipated);
  if (!summary) return { ok: false, error: "Please write a short summary." };
  if (![served, volunteers].every((n) => Number.isInteger(n) && n >= 0)) {
    return { ok: false, error: "Beneficiaries and volunteers must be whole numbers (0 or more)." };
  }

  const outcomes = readOutcomes();
  outcomes[campId] = {
    summary,
    beneficiariesServed: served,
    volunteersParticipated: volunteers,
    servicesProvided: String(data.servicesProvided || "").trim(),
    materialsDistributed: String(data.materialsDistributed || "").trim(),
    reportedAt: new Date().toISOString(),
  };
  localStorage.setItem(OUTCOME_KEY, JSON.stringify(outcomes));
  updateCamp({ id: campId, outcomeSummary: summary }); // shows on the public camp page
  return { ok: true };
}
