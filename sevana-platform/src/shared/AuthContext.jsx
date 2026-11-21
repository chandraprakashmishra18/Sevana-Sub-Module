import { useCallback, useEffect, useState } from "react";
import { apiRequest, getAccessToken, setAccessToken, getCachedBackendUser, setCachedBackendUser, setUnauthorizedHandler } from "./apiClient";
import { AuthContext } from "./AuthContextInstance";

function normalizeUser(user) {
  const organization = user.memberships?.[0]?.organization;
  return { ...user, name: user.fullName || user.name, roleType: organization ? "organizer" : "citizen", organization: organization?.name || "", authMode: "backend" };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getAccessToken() ? getCachedBackendUser() : null);
  const [loading, setLoading] = useState(true);
  const clearSession = useCallback(() => { setAccessToken(null); setUser(null); }, []);

  useEffect(() => {
    setUnauthorizedHandler(clearSession);
    let active = true;
    const restore = async () => {
      if (!getAccessToken()) { if (active) { setCachedBackendUser(null); setUser(null); setLoading(false); } return; }
      try {
        const response = await apiRequest("/auth/me");
        const next = normalizeUser(response.data);
        if (active) { setCachedBackendUser(next); setUser(next); }
      } catch { clearSession(); }
      finally { if (active) setLoading(false); }
    };
    restore();
    return () => { active = false; setUnauthorizedHandler(null); };
  }, [clearSession]);

  const authenticate = async (path, payload) => {
    setLoading(true); clearSession();
    try {
      const response = await apiRequest(path, { method: "POST", body: payload });
      if (!response?.data?.accessToken) throw new Error("The API did not return a valid sign-in session.");
      setAccessToken(response.data.accessToken);
      const identity = await apiRequest("/auth/me");
      if (!identity?.data?.id) throw new Error("The API did not return a valid user profile.");
      const next = normalizeUser(identity.data); setCachedBackendUser(next); setUser(next); return next;
    } catch (error) { clearSession(); throw error; }
    finally { setLoading(false); }
  };

  const register = (data) => {
    const organizationAccount = data.roleType === "organizer" && Boolean(data.organization?.trim());
    return authenticate("/auth/register", {
      fullName: data.name || data.fullName, email: data.email, password: data.password, phone: data.phone,
      accountType: organizationAccount ? "ORGANIZATION" : "INDIVIDUAL",
      ...(organizationAccount ? { organizationName: data.organization.trim(), organizationType: data.organizationType || "OTHER" } : {}),
    });
  };
  const login = (email, password) => authenticate("/auth/login", { email, password });
  const logout = () => { clearSession(); setLoading(false); };
  const updateProfile = async (updates) => { const response = await apiRequest("/users/me", { method: "PATCH", body: updates }); const next = normalizeUser({ ...user, ...response.data }); setCachedBackendUser(next); setUser(next); return next; };
  const value = { user, isAuthenticated: Boolean(user) && !loading, loading, register, login, logout,
    updateProfile, addXP: () => null, onCampOrganized: () => null, onCampJoined: () => null, onDonation: () => null };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
