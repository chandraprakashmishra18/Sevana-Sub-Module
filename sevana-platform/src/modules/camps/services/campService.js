import { apiRequest } from "../api/client";

function toView(camp) {
  const counts = camp.registrationCounts || {};
  const startsAt = new Date(camp.startsAt);
  const endsAt = new Date(camp.endsAt);
  const status = camp.status === "CANCELLED" ? "cancelled" : camp.status === "COMPLETED" || startsAt < new Date() ? "past" : "upcoming";
  const city = camp.city || "";
  return {
    ...camp, type: camp.type === "MEDICAL" ? "Medical" : "Educational", publicationStatus: camp.status, status,
    targetBeneficiary: camp.targetAudience || "General", organizer: camp.organizationName || "Organization",
    organizerVerified: camp.organizationStatus === "VERIFIED", image: camp.imageUrl || "",
    date: startsAt.toISOString().slice(0, 10), time: `${startsAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} – ${endsAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`,
    location: [camp.venue, camp.address, city].filter(Boolean).join(", "),
    workerSlots: { total: null, filled: counts.volunteers || 0 },
    attendeeSlots: { total: camp.capacity ?? null, filled: counts.total || 0 },
    workerRolesNeeded: camp.serviceDetails ? camp.serviceDetails.split(",").map((role) => role.trim()).filter(Boolean) : [],
  };
}

function parseStart(camp) {
  if (camp.startsAt) return new Date(camp.startsAt);
  const date = new Date(`${camp.date || ""}T00:00:00`);
  const time = String(camp.time || "9:00 AM").split(/[–-]/)[0].trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (time && !Number.isNaN(date.getTime())) {
    let hour = Number(time[1]) % 12;
    if (time[3].toUpperCase() === "PM") hour += 12;
    date.setHours(hour, Number(time[2]), 0, 0);
  }
  return date;
}
function toPayload(camp) {
  const startDate = parseStart(camp);
  const endDate = camp.endsAt ? new Date(camp.endsAt) : new Date(startDate.getTime() + 4 * 60 * 60 * 1000);
  const status = camp.status ? ({ upcoming: "PUBLISHED", ongoing: "PUBLISHED", past: "COMPLETED", cancelled: "CANCELLED" }[camp.status] || camp.status) : undefined;
  return {
    ...(camp.title !== undefined ? { title: camp.title } : {}),
    ...(camp.description !== undefined ? { description: camp.description } : {}),
    ...(camp.type !== undefined ? { type: String(camp.type).toUpperCase() } : {}),
    ...(camp.targetBeneficiary !== undefined ? { targetAudience: camp.targetBeneficiary } : {}),
    ...(camp.workerRolesNeeded !== undefined ? { serviceDetails: Array.isArray(camp.workerRolesNeeded) ? camp.workerRolesNeeded.join(", ") : camp.workerRolesNeeded } : {}),
    ...(camp.location !== undefined ? { venue: camp.location.slice(0, 200), address: camp.location } : {}),
    ...(startDate && !Number.isNaN(startDate.getTime()) ? { startsAt: startDate.toISOString() } : {}),
    ...(startDate && !Number.isNaN(startDate.getTime()) ? { endsAt: endDate.toISOString() } : {}),
    ...(status ? { status } : {}),
  };
}

export async function getAllCamps() {
  const response = await apiRequest("/camps");
  return (response.data || []).map(toView);
}
export async function getCampById(id) {
  const response = await apiRequest(`/camps/${encodeURIComponent(id)}`);
  return response.data ? toView(response.data) : null;
}
export async function getUpcomingCamps() { return (await getAllCamps()).filter((camp) => camp.status === "upcoming"); }
export async function getPastCamps() { return (await getAllCamps()).filter((camp) => camp.status === "past"); }
export async function createCamp(camp) { const response = await apiRequest("/camps", { method: "POST", body: toPayload(camp) }); return toView(response.data); }
export async function updateCamp(camp) { const response = await apiRequest(`/camps/${encodeURIComponent(camp.id)}`, { method: "PATCH", body: toPayload(camp) }); return toView(response.data); }
export async function getOrganizationCamps() { const response = await apiRequest("/camps/mine"); return (response.data || []).map(toView); }
