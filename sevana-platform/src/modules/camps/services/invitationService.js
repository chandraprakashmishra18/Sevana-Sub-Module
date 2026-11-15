// Invitations have no backend route yet; never present browser-only records as sent invitations.
export async function getInvitationsByUser() {
  return { received: [], sent: [] };
}

export async function sendInvitation() {
  throw new Error("Camp invitations are not supported by the current backend API.");
}

export async function updateInvitationStatus() {
  throw new Error("Camp invitations are not supported by the current backend API.");
}
