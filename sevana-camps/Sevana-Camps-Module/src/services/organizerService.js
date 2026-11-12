import mockOrganizers from "../data/mockOrganizers";
import { saveCreatedCamp } from "./campService";
import { awardCommunityXP } from "./communityService";
import { getCurrentUser, awardUserXP, recordUserCampOrganized } from "./authService";

export async function getAllOrganizers() {
  return Promise.resolve(mockOrganizers);
}

export async function getOrganizerById(id) {
  const found = mockOrganizers.find((o) => o.id === id);
  return Promise.resolve(found || null);
}

export async function submitNewCamp(campData) {
  const campId = `community-${Date.now()}`;
  const currentUser = getCurrentUser();
  const organizerName = campData.organizer || (currentUser ? (currentUser.organization || currentUser.name) : "Community Organizer");

  const camp = {
    ...campData,
    id: campId,
    organizer: organizerName,
    organizerId: currentUser ? currentUser.id : null,
    organizerVerified: !!(currentUser && currentUser.organization),
    image: campData.image || "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop",
    workerSlots: { total: 20, filled: 0 },
    attendeeSlots: { total: 100, filled: 0 },
    workerRolesNeeded: (campData.workerRolesNeeded || "General Volunteer").split(",").map((role) => role.trim()),
    status: "upcoming",
    approvalStatus: "approved",
  };

  try {
    saveCreatedCamp(camp);
    if (currentUser) {
      awardUserXP(currentUser.id, 300, `Organized ${camp.title}`);
      recordUserCampOrganized(currentUser.id, campId);
    }
    awardCommunityXP({
      eventId: `camp-created:${campId}`,
      kind: "organize",
      xp: 300,
      description: `Organized ${camp.title}`,
      email: currentUser ? currentUser.email : "volunteer@example.com",
    });
    return { success: true, campId };
  } catch {
    return { success: false, error: "Could not save this camp in this browser." };
  }
}
