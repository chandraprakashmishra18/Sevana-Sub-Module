import { apiRequest } from "../../../shared/apiClient";

function normalizeCamp(camp) {
  const startsAt = camp.startsAt ? new Date(camp.startsAt) : null;
  const now = new Date();
  const status = camp.status === "PUBLISHED"
    ? (camp.endsAt && new Date(camp.endsAt) < now ? "past" : "upcoming")
    : camp.status === "COMPLETED" ? "past" : camp.status.toLowerCase();
  return {
    ...camp,
    apiStatus: camp.status,
    status,
    type: camp.type === "MEDICAL" ? "Medical" : "Educational",
    date: startsAt ? startsAt.toISOString().slice(0, 10) : "",
    time: startsAt ? startsAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
    location: camp.address || camp.venue || [camp.city, camp.state].filter(Boolean).join(", "),
    organizer: camp.organization?.name || "Sevana organization",
    organizerVerified: camp.organization?.verificationStatus === "VERIFIED",
    targetBeneficiary: camp.targetAudience || "General Community",
    attendeeSlots: { total: camp.capacity || 0, filled: camp._count?.registrations || 0 },
    workerSlots: { total: camp.capacity || 0, filled: camp._count?.registrations || 0 },
    workerRolesNeeded: camp.serviceDetails ? camp.serviceDetails.split(",").map((role) => role.trim()) : ["General Volunteer"],
    image: camp.imageUrl || "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop"
  };
}

export async function getAllCamps({ organizationId } = {}) {
  if (organizationId) {
    const result = await apiRequest(`/camps/mine?organizationId=${encodeURIComponent(organizationId)}`);
    return (result?.data || []).map(normalizeCamp);
  }
  const first = await apiRequest("/camps?page=1&limit=100");
  const camps = [...(first?.data || [])];
  const pages = first?.pagination?.totalPages || 1;
  for (let page = 2; page <= pages; page += 1) {
    const result = await apiRequest(`/camps?page=${page}&limit=100`);
    camps.push(...(result?.data || []));
  }
  return camps.map(normalizeCamp);
}

export async function getCampById(id) {
  const result = await apiRequest(`/camps/${encodeURIComponent(id)}`);
  return result?.data ? normalizeCamp(result.data) : null;
}

export async function getUpcomingCamps() {
  return (await getAllCamps()).filter((camp) => camp.status === "upcoming");
}

export async function getPastCamps() {
  return (await getAllCamps()).filter((camp) => camp.status === "past");
}

export async function createCamp(payload) {
  const result = await apiRequest("/camps", { method: "POST", body: payload });
  return normalizeCamp(result.data);
}

export async function updateCamp(campOrId, updates) {
  const id = typeof campOrId === "string" ? campOrId : campOrId.id;
  const fields = typeof campOrId === "string" ? updates : campOrId;
  const date = fields.startsAt || fields.date;
  const body = {
    ...(fields.title !== undefined ? { title: fields.title } : {}),
    ...(fields.description !== undefined ? { description: fields.description } : {}),
    ...(fields.type !== undefined ? { type: ["MEDICAL", "EDUCATIONAL"].includes(fields.type) ? fields.type : fields.type.toUpperCase() } : {}),
    ...(fields.serviceDetails !== undefined ? { serviceDetails: fields.serviceDetails } : {}),
    ...(fields.targetAudience !== undefined ? { targetAudience: fields.targetAudience } : {}),
    ...(fields.venue !== undefined ? { venue: fields.venue } : {}),
    ...(fields.address !== undefined ? { address: fields.address } : {}),
    ...(fields.city !== undefined ? { city: fields.city } : {}),
    ...(fields.state !== undefined ? { state: fields.state } : {}),
    ...(fields.startsAt || date ? { startsAt: fields.startsAt || new Date(`${date}T${fields.time || "09:00"}`).toISOString() } : {}),
    ...(fields.endsAt ? { endsAt: fields.endsAt } : {}),
    ...(fields.registrationDeadline !== undefined ? { registrationDeadline: fields.registrationDeadline || null } : {}),
    ...(fields.capacity !== undefined ? { capacity: Number(fields.capacity) } : {})
  };
  const result = await apiRequest(`/camps/${encodeURIComponent(id)}`, { method: "PATCH", body });
  return normalizeCamp(result.data);
}

export async function publishCamp(id) {
  const result = await apiRequest(`/camps/${encodeURIComponent(id)}/publish`, { method: "POST" });
  return normalizeCamp(result.data);
}

export async function cancelCamp(id) {
  const result = await apiRequest(`/camps/${encodeURIComponent(id)}/cancel`, { method: "POST" });
  return normalizeCamp(result.data);
}
