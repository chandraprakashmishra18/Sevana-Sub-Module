import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import {
  AUTH_USER_STORAGE_KEY,
  fetchAuthenticatedUser,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
  awardUserXP,
  recordUserCampOrganized,
  recordUserCampJoined,
  recordUserDonation
} from "../modules/donations/services/authService";
import { TOKEN_STORAGE_KEY } from "./apiClient";

export const AuthContext = createContext(null);
const ACTIVE_ORGANIZATION_KEY = "sevana_active_organization";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeOrganizationId, setActiveOrganizationIdState] = useState(
    () => localStorage.getItem(ACTIVE_ORGANIZATION_KEY) || ""
  );

  const refreshProfile = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_STORAGE_KEY)) {
      setUser(null);
      return null;
    }

    const current = await fetchAuthenticatedUser();
    setUser(current);
    return current;
  }, []);

  useEffect(() => {
    let active = true;
    const restore = async () => {
      setLoading(true);
      try {
        const restored = await refreshProfile();
        if (active) setUser(restored);
      } catch (error) {
        if (error.status === 401) logoutUser();
        if (active) setUser(getCurrentUser());
      } finally {
        if (active) setLoading(false);
      }
    };

    const handleAuthChange = (event) => {
      setUser(event.detail || getCurrentUser());
    };
    const handleStorageChange = (event) => {
      if (event.key === TOKEN_STORAGE_KEY) restore();
      if (event.key === AUTH_USER_STORAGE_KEY) setUser(getCurrentUser());
    };

    window.addEventListener("sevana_auth_changed", handleAuthChange);
    window.addEventListener("storage", handleStorageChange);
    restore();

    return () => {
      active = false;
      window.removeEventListener("sevana_auth_changed", handleAuthChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [refreshProfile]);

  const organizations = useMemo(
    () => (user?.memberships || []).map((membership) => ({
      ...membership.organization,
      membershipRole: membership.role
    })),
    [user]
  );

  const activeOrganization = organizations.find(
    (organization) => organization.id === activeOrganizationId
  ) || organizations[0] || null;

  useEffect(() => {
    if (!organizations.length) {
      localStorage.removeItem(ACTIVE_ORGANIZATION_KEY);
      setActiveOrganizationIdState("");
      return;
    }

    if (!organizations.some((organization) => organization.id === activeOrganizationId)) {
      const nextId = organizations[0].id;
      localStorage.setItem(ACTIVE_ORGANIZATION_KEY, nextId);
      setActiveOrganizationIdState(nextId);
    }
  }, [organizations, activeOrganizationId]);

  const setActiveOrganizationId = (organizationId) => {
    if (!organizations.some((organization) => organization.id === organizationId)) return;
    localStorage.setItem(ACTIVE_ORGANIZATION_KEY, organizationId);
    setActiveOrganizationIdState(organizationId);
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const next = await registerUser(data);
      setUser(next);
      return next;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const next = await loginUser(email, password);
      setUser(next);
      return next;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const updateProfile = (updates) => {
    if (!user) return null;
    const next = updateUserProfile(user.id, updates);
    if (next) setUser(next);
    return next;
  };

  const addXP = (amount, reason) => user
    ? (setUser(awardUserXP(user.id, amount, reason)), getCurrentUser())
    : null;
  const onCampOrganized = (id) => user
    ? (setUser(recordUserCampOrganized(user.id, id)), getCurrentUser())
    : null;
  const onCampJoined = (data) => user
    ? (setUser(recordUserCampJoined(user.id, data)), getCurrentUser())
    : null;
  const onDonation = (data) => user
    ? (setUser(recordUserDonation(user.id, data)), getCurrentUser())
    : null;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: Boolean(user),
      loading,
      register,
      login,
      logout,
      updateProfile,
      addXP,
      onCampOrganized,
      onCampJoined,
      onDonation,
      organizations,
      activeOrganization,
      setActiveOrganizationId,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}
