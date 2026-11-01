import mockOrganizers from "../data/mockOrganizers";
import { saveCreatedCamp } from "./campService";
import { awardCommunityXP } from "./communityService";

export async function getAllOrganizers() {
  return Promise.resolve(mockOrganizers);
}

export async function getOrganizerById(id) {
  const found = mockOrganizers.find((o) => o.id === id);
  return Promise.resolve(found || null);
}

// TEAMMATE: this is where a new camp gets created and linked to this organizer.
// For now it just logs and returns success — wire this to a real POST /organizers/:id/camps later.
export async function submitNewCamp(campData) {
  const campId = `community-${Date.now()}`;
  const camp = {
    ...campData,
    id: campId,
    organizer: campData.organizer || "Community Organizer",
    organizerVerified: false,
    image: "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg",
    workerSlots: { total: 20, filled: 0 },
    attendeeSlots: { total: 100, filled: 0 },
    workerRolesNeeded: (campData.workerRolesNeeded || "General Volunteer").split(",").map((role) => role.trim()),
    status: "upcoming",
    approvalStatus: "pending",
  };
  try {
    saveCreatedCamp(camp);
    awardCommunityXP({ eventId: `camp-created:${campId}`, kind: "organize", xp: 300, description: `Organized ${camp.title}` });
    return { success: true, campId };
  } catch {
    return { success: false, error: "Could not save this camp in this browser." };
  }
}
