import mockInvitations from "../data/mockInvitations";

// In-memory store (simulates a backend)
let _invitations = [...mockInvitations];

/**
 * Returns all invitations relevant to a user —
 * both received (toEmail matches) and sent (fromUserId matches).
 */
export async function getInvitationsByUser(userId) {
  // For demo purposes: "currentUser" is the logged-in user,
  // and "volunteer@example.com" is their email.
  const received = _invitations.filter(
    (inv) => inv.toEmail === "volunteer@example.com"
  );
  const sent = _invitations.filter((inv) => inv.fromUserId === "currentUser");
  return Promise.resolve({ received, sent });
}

/**
 * Sends a new invitation.
 * data: { campId, campTitle, toEmail, role, message }
 */
export async function sendInvitation(data) {
  const newInvitation = {
    id: `inv${Date.now()}`,
    campId: data.campId,
    campTitle: data.campTitle,
    fromUserId: "currentUser",
    fromName: "You",
    toEmail: data.toEmail,
    status: "pending",
    message: data.message || "",
    createdAt: new Date().toISOString().split("T")[0],
    role: data.role,
  };
  _invitations = [newInvitation, ..._invitations];
  return Promise.resolve(newInvitation);
}

/**
 * Updates the status of an invitation (accept or decline).
 */
export async function updateInvitationStatus(id, status) {
  _invitations = _invitations.map((inv) =>
    inv.id === id ? { ...inv, status } : inv
  );
  const updated = _invitations.find((inv) => inv.id === id);
  return Promise.resolve(updated);
}
