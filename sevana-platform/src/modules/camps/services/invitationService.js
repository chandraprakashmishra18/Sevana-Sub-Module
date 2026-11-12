import mockInvitations from "../data/mockInvitations";
import { awardCommunityXP } from "./communityService";
import { getCurrentUser, awardUserXP } from "./authService";

const STORAGE_KEY = "sevana_camps_invitations";

function loadInvitations() {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
  }
  return [...mockInvitations];
}

function saveInvitations(invs) {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invs));
    } catch {
      // ignore
    }
  }
}

let _invitations = loadInvitations();

/**
 * Returns all invitations relevant to a user —
 * both received (toEmail matches) and sent (fromUserId matches).
 */
export async function getInvitationsByUser(userId = null, email = null) {
  _invitations = loadInvitations();
  const currentUser = getCurrentUser();
  const effectiveUserId = userId || (currentUser ? currentUser.id : "currentUser");
  const effectiveEmail = (email || (currentUser ? currentUser.email : "volunteer@example.com")).toLowerCase().trim();

  const received = _invitations.filter((inv) => {
    const invEmail = (inv.toEmail || "").toLowerCase().trim();
    return invEmail === effectiveEmail || (!currentUser && invEmail === "volunteer@example.com");
  });

  const sent = _invitations.filter(
    (inv) => inv.fromUserId === effectiveUserId || (currentUser && inv.fromEmail?.toLowerCase() === currentUser.email.toLowerCase())
  );

  return Promise.resolve({ received, sent });
}

/**
 * Sends a new invitation to another person to arrange or organize a camp.
 * data: { campId, campTitle, targetBeneficiary, toEmail, role, message }
 */
export async function sendInvitation(data) {
  const currentUser = getCurrentUser();
  const newInvitation = {
    id: `inv${Date.now()}`,
    campId: data.campId,
    campTitle: data.campTitle || "Community Service Camp",
    targetBeneficiary: data.targetBeneficiary || "General",
    fromUserId: currentUser ? currentUser.id : "currentUser",
    fromName: currentUser ? currentUser.name : "You",
    fromEmail: currentUser ? currentUser.email : "volunteer@example.com",
    toEmail: data.toEmail.trim().toLowerCase(),
    status: "pending",
    message: data.message || "",
    createdAt: new Date().toISOString().split("T")[0],
    role: data.role || "worker",
    xpReward: data.role === "organizer" ? 250 : 150,
  };

  _invitations = [newInvitation, ..._invitations];
  saveInvitations(_invitations);
  return Promise.resolve(newInvitation);
}

/**
 * Updates the status of an invitation (accept or decline).
 * Accepting rewards community service XP points to the real user!
 */
export async function updateInvitationStatus(id, status) {
  _invitations = _invitations.map((inv) =>
    inv.id === id ? { ...inv, status } : inv
  );
  saveInvitations(_invitations);
  const updated = _invitations.find((inv) => inv.id === id);

  if (updated && status === "accepted") {
    const currentUser = getCurrentUser();
    const xp = updated.xpReward || 150;
    if (currentUser) {
      awardUserXP(currentUser.id, xp, `Accepted invite: ${updated.campTitle}`);
    }
    awardCommunityXP({
      eventId: `invitation:${id}`,
      kind: "invitation",
      xp,
      description: `Accepted ${updated.campTitle}`,
      email: currentUser ? currentUser.email : updated.toEmail,
    });
  }

  return Promise.resolve(updated);
}
