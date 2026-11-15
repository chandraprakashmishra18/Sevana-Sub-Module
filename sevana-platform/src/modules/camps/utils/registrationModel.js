// One place that knows how a saved registration looks.
// Mirrors the DB enums (RegistrationStatus, AttendanceStatus, CampRegistrationRole)
// and tolerates older records saved as "pending" / "approved" / "attended".
export const JOIN_KEY = "sevana_camp_joins";

const STATUS_MAP = {
  pending: "REGISTERED",
  approved: "REGISTERED",
  registered: "REGISTERED",
  waitlisted: "WAITLISTED",
  rejected: "CANCELLED",
  cancelled: "CANCELLED",
};

export function readRegistrations() {
  try {
    return JSON.parse(localStorage.getItem(JOIN_KEY) || "[]");
  } catch {
    return [];
  }
}

export function writeRegistrations(list) {
  localStorage.setItem(JOIN_KEY, JSON.stringify(list));
}

export function normalizeRegistration(r) {
  return {
    ...r,
    fullName: r.fullName || r.name || r.email || "Participant",
    role: r.role === "worker" || r.role === "VOLUNTEER" ? "VOLUNTEER" : "BENEFICIARY",
    status: STATUS_MAP[String(r.status || "").toLowerCase()] || "REGISTERED",
    attendance: r.attendance || (r.attended ? "PRESENT" : null),
  };
}

export const isCancelled = (r) => normalizeRegistration(r).status === "CANCELLED";
// Only REGISTERED people take up a slot (waitlisted and cancelled do not).
export const holdsSlot = (r) => normalizeRegistration(r).status === "REGISTERED";
