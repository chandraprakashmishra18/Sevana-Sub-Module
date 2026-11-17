// Real User Authentication & Account Management Service
import { apiRequest, TOKEN_STORAGE_KEY } from "../../../shared/apiClient";

export const USERS_STORAGE_KEY = "sevana_users";
export const AUTH_USER_STORAGE_KEY = "sevana_auth_user";

export const DEFAULT_AVATARS = {
  doctor: "https://images.unsplash.com/photo-1594824813627-c10df48db6e5?w=200&auto=format&fit=crop",
  teacher: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop",
  volunteer: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop",
  organizer: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop",
  donor: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop",
  citizen: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop",
};

export const SEED_USERS = [
  {
    id: "usr_rohit_01",
    name: "Rohit Sharma",
    email: "rohit@sevana.org",
    role: "Volunteer Coordinator",
    roleType: "volunteer",
    phone: "+91 98765 43210",
    location: "Sector 21, Gurugram",
    organization: "Youth Service Forum",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop",
    totalXP: 820,
    badges: ["First Camp", "5 Camps Milestone", "Medical Specialist", "Community Star"],
    campsWorked: [
      { campId: "camp4", role: "Career Counselor", xpEarned: 120, date: "2026-08-15", title: "Career & Scholarship Awareness Camp" },
      { campId: "camp1", role: "Registration Desk", xpEarned: 80, date: "2026-10-05", title: "Free Eye Checkup & Medicine Camp" },
      { campId: "camp7", role: "Food Packer", xpEarned: 100, date: "2026-11-15", title: "NGO Food Drive & Nutrition Awareness" },
    ],
    campsOrganized: [],
    donations: [],
    createdAt: "2026-06-10",
  },
  {
    id: "usr_priya_02",
    name: "Dr. Priya Menon",
    email: "priya.doctor@sevana.org",
    role: "Doctor & Geriatric Specialist",
    roleType: "doctor",
    phone: "+91 98111 22334",
    location: "DLF Phase 4, Gurugram",
    organization: "Civil Hospital & Aarogya Trust",
    avatar: "https://images.unsplash.com/photo-1594824813627-c10df48db6e5?w=200&auto=format&fit=crop",
    totalXP: 1620,
    badges: ["First Camp", "10 Camps Milestone", "Medical Specialist", "Elder Friend", "Legend Achiever"],
    campsWorked: [
      { campId: "camp1", role: "Doctor", xpEarned: 200, date: "2026-10-05", title: "Free Eye Checkup & Medicine Camp" },
      { campId: "camp6", role: "Doctor", xpEarned: 250, date: "2026-11-08", title: "Old Age Home Health Check Drive" },
      { campId: "camp8", role: "Paediatrician", xpEarned: 200, date: "2026-10-20", title: "Medical Screening Camp for Orphanage Children" },
    ],
    campsOrganized: ["camp6"],
    donations: [{ campaignId: "c6", campaignTitle: "Healthcare, Medicine & Mobility Walkers for Old Age Home", amount: 2000, xpEarned: 120, date: "2026-10-25" }],
    createdAt: "2026-05-15",
  },
  {
    id: "usr_roshni_03",
    name: "Aarti Mehra",
    email: "contact@roshnifoundation.org",
    role: "NGO Organizer",
    roleType: "organizer",
    phone: "+91 99998 88777",
    location: "Sector 14, Gurugram",
    organization: "Roshni Foundation",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop",
    totalXP: 2100,
    badges: ["Verified NGO Leader", "10+ Camps Organized", "Philanthropy Pillar"],
    campsWorked: [],
    campsOrganized: ["camp1", "camp8"],
    donations: [],
    createdAt: "2026-04-01",
  },
  {
    id: "usr_aditya_04",
    name: "Aditya Rao",
    email: "aditya.teacher@gmail.com",
    role: "Teacher & Educator",
    roleType: "teacher",
    phone: "+91 98222 33445",
    location: "Sector 14, Gurugram",
    organization: "Government School Unit",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop",
    totalXP: 580,
    badges: ["First Camp", "Youth Mentor", "Digital Literacy Lead"],
    campsWorked: [
      { campId: "camp2", role: "Teacher", xpEarned: 150, date: "2026-10-12", title: "Spoken English & Digital Literacy Workshop" },
      { campId: "camp5", role: "Storyteller", xpEarned: 130, date: "2026-11-02", title: "Orphanage Joy Day — Arts & Crafts" },
    ],
    campsOrganized: [],
    donations: [],
    createdAt: "2026-07-20",
  },
];

export function getUsers() {
  let users = SEED_USERS;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) users = parsed;
    }
  } catch {
    users = SEED_USERS;
  }

  const currentUser = getCurrentUser();
  if (currentUser && !users.some((user) => user.id === currentUser.id)) {
    users = [...users, currentUser];
  }

  const sanitized = users.map(sanitizeUser);
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(sanitized));
  } catch {
    // User profiles remain available from the authenticated profile cache.
  }
  return sanitized;
}

export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users.map(sanitizeUser)));
  } catch (err) {
    console.error("Failed to save users to localStorage", err);
  }
}

function sanitizeUser(user) {
  if (!user || typeof user !== "object") return user;
  const safeUser = { ...user };
  delete safeUser.password;
  return safeUser;
}

function normalizeUser(user) {
  const memberships = Array.isArray(user.memberships) ? user.memberships : [];
  const primaryOrganization = memberships[0]?.organization || null;
  return {
    ...sanitizeUser(user),
    name: user.fullName || user.name || "Sevana user",
    role: memberships[0]?.role || "Community member",
    roleType: memberships.length ? "organizer" : "citizen",
    organization: primaryOrganization?.name || "",
    memberships
  };
}

export function getCurrentUser() {
  try {
    if (!localStorage.getItem(TOKEN_STORAGE_KEY)) return null;
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!raw) return null;
    return normalizeUser(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  try {
    if (user) {
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(normalizeUser(user)));
    } else {
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("sevana_auth_changed", { detail: user }));
    }
  } catch (err) {
    console.error("Failed to set current user in localStorage", err);
  }
}

export async function fetchAuthenticatedUser() {
  const result = await apiRequest("/auth/me");
  const user = normalizeUser(result.data);
  setCurrentUser(user);
  return user;
}

async function saveAuthResponse(result) {
  const accessToken = result?.data?.accessToken;
  if (!accessToken) throw new Error("Authentication response did not include an access token.");
  localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  try {
    return await fetchAuthenticatedUser();
  } catch (error) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    throw error;
  }
}

export async function registerUser(userData) {
  const result = await apiRequest("/auth/register", {
    method: "POST",
    body: userData
  });
  return saveAuthResponse(result);
}

export async function loginUser(email, password) {
  const result = await apiRequest("/auth/login", {
    method: "POST",
    body: { email, password }
  });
  return saveAuthResponse(result);
}

export function logoutUser() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  setCurrentUser(null);
}

export function updateUserProfile(userId, updates) {
  const users = getUsers();
  let updatedUser = null;

  const nextUsers = users.map((u) => {
    if (u.id === userId) {
      updatedUser = { ...u, ...updates };
      return updatedUser;
    }
    return u;
  });

  saveUsers(nextUsers);

  const current = getCurrentUser();
  if (current && current.id === userId) {
    setCurrentUser(updatedUser);
  }

  return updatedUser;
}

export function awardUserXP(userId, addedXP, reason = "") {
  const users = getUsers();
  let updatedUser = null;

  const nextUsers = users.map((u) => {
    if (u.id === userId) {
      const newXP = (u.totalXP || 0) + addedXP;
      const badges = [...(u.badges || [])];

      if (newXP >= 100 && !badges.includes("Sprout Volunteer")) {
        badges.push("Sprout Volunteer");
      }
      if (newXP >= 300 && !badges.includes("Sapling Contributor")) {
        badges.push("Sapling Contributor");
      }
      if (newXP >= 700 && !badges.includes("Tree of Impact")) {
        badges.push("Tree of Impact");
      }
      if (newXP >= 1500 && !badges.includes("Legend Achiever")) {
        badges.push("Legend Achiever");
      }

      updatedUser = { ...u, totalXP: newXP, badges };
      return updatedUser;
    }
    return u;
  });

  saveUsers(nextUsers);

  const current = getCurrentUser();
  if (current && current.id === userId) {
    setCurrentUser(updatedUser);
  }

  return updatedUser;
}

export function recordUserCampOrganized(userId, campId) {
  const users = getUsers();
  let updatedUser = null;

  const nextUsers = users.map((u) => {
    if (u.id === userId) {
      const organized = Array.isArray(u.campsOrganized) ? [...u.campsOrganized, campId] : [campId];
      const badges = [...(u.badges || [])];
      if (!badges.includes("Camp Organizer")) {
        badges.push("Camp Organizer");
      }
      updatedUser = { ...u, campsOrganized: organized, badges };
      return updatedUser;
    }
    return u;
  });

  saveUsers(nextUsers);

  const current = getCurrentUser();
  if (current && current.id === userId) {
    setCurrentUser(updatedUser);
  }

  return updatedUser;
}

export function recordUserCampJoined(userId, campAction) {
  const users = getUsers();
  let updatedUser = null;

  const nextUsers = users.map((u) => {
    if (u.id === userId) {
      const worked = Array.isArray(u.campsWorked) ? [campAction, ...u.campsWorked] : [campAction];
      const badges = [...(u.badges || [])];
      if (worked.length >= 1 && !badges.includes("First Camp")) {
        badges.push("First Camp");
      }
      if (worked.length >= 5 && !badges.includes("5 Camps Milestone")) {
        badges.push("5 Camps Milestone");
      }
      updatedUser = { ...u, campsWorked: worked, badges };
      return updatedUser;
    }
    return u;
  });

  saveUsers(nextUsers);

  const current = getCurrentUser();
  if (current && current.id === userId) {
    setCurrentUser(updatedUser);
  }

  return updatedUser;
}

export function recordUserDonation(userId, donationAction) {
  const users = getUsers();
  let updatedUser = null;

  const nextUsers = users.map((u) => {
    if (u.id === userId) {
      const donations = Array.isArray(u.donations) ? [donationAction, ...u.donations] : [donationAction];
      const badges = [...(u.badges || [])];
      if (!badges.includes("Supporter")) {
        badges.push("Supporter");
      }
      if (donations.length >= 3 && !badges.includes("Consistent Donor")) {
        badges.push("Consistent Donor");
      }
      updatedUser = { ...u, donations, badges };
      return updatedUser;
    }
    return u;
  });

  saveUsers(nextUsers);

  const current = getCurrentUser();
  if (current && current.id === userId) {
    setCurrentUser(updatedUser);
  }

  return updatedUser;
}

