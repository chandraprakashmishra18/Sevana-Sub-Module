import mockOrganizers from "../data/mockOrganizers";

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
  console.log("New camp submitted (mock):", campData);
  return Promise.resolve({ success: true, campId: `camp${Date.now()}` });
}