// Real User Authentication & Account Management Service
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
    password: "password123",
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
    password: "password123",
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
    password: "password123",
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
    password: "password123",
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
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    return parsed;
  } catch {
    return SEED_USERS;
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("Failed to save users to localStorage", err);
  }
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  try {
    if (user) {
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
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

export function registerUser(userData) {
  const users = getUsers();
  const normalizedEmail = (userData.email || "").trim().toLowerCase();

  if (!normalizedEmail || !userData.password || !userData.name) {
    throw new Error("Full name, email, and password are required.");
  }

  if (userData.password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error("An account with this email address already exists.");
  }

  const roleKey = (userData.roleType || "volunteer").toLowerCase();
  const defaultAvatar = DEFAULT_AVATARS[roleKey] || DEFAULT_AVATARS.volunteer;

  const newUser = {
    id: `usr_${Date.now()}`,
    name: userData.name.trim(),
    email: normalizedEmail,
    password: userData.password,
    role: userData.role || "Community Volunteer",
    roleType: userData.roleType || "volunteer",
    phone: userData.phone?.trim() || "",
    location: userData.location?.trim() || "India",
    organization: userData.organization?.trim() || "",
    avatar: userData.avatar || defaultAvatar,
    totalXP: 50,
    badges: ["New Member", "Community Volunteer"],
    campsWorked: [],
    campsOrganized: [],
    donations: [],
    createdAt: new Date().toISOString().split("T")[0],
  };

  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);

  return newUser;
}

export function loginUser(email, password) {
  const users = getUsers();
  const normalizedEmail = (email || "").trim().toLowerCase();

  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    throw new Error("No account found with this email. Please check or register a new account.");
  }

  if (user.password !== password) {
    throw new Error("Incorrect password. Please try again.");
  }

  setCurrentUser(user);
  return user;
}

export function logoutUser() {
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
