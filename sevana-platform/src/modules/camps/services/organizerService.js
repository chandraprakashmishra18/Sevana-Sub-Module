import { createCamp } from "./campService";

export async function getAllOrganizers() { return []; }
export async function getOrganizerById() { return null; }

export async function submitNewCamp(formData, organizationId) {
  if (!organizationId) throw new Error("Select an organization before creating a camp.");
  const startsAt = new Date(`${formData.date}T${formData.startTime || "09:00"}:00`);
  const endsAt = new Date(`${formData.date}T${formData.endTime || "16:00"}:00`);
  const [city = "", ...stateParts] = String(formData.location || "").split(",");
  const saved = await createCamp({
    organizationId,
    title: formData.title.trim(),
    description: formData.description.trim(),
    type: formData.type === "Medical" ? "MEDICAL" : "EDUCATIONAL",
    serviceDetails: formData.workerRolesNeeded || undefined,
    targetAudience: formData.targetBeneficiary || undefined,
    venue: formData.location.trim(),
    address: formData.location.trim(),
    city: city.trim() || undefined,
    state: stateParts.join(",").trim() || undefined,
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
    capacity: 100
  });
  return { success: true, camp: saved, campId: saved.id };
}
