import { createContext, useCallback, useEffect, useState } from "react";
import {
  getCurrentUser, loginUser, logoutUser, updateUserProfile,
  awardUserXP, recordUserCampOrganized, recordUserCampJoined, recordUserDonation,
} from "../modules/donations/services/authService";
import { apiRequest, getAccessToken, setAccessToken, setUnauthorizedHandler } from "./apiClient";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

function publicUser(user) {
  return {
    ...user,
    name: user.fullName || user.name,
    authMode: "backend",
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser() ? { ...getCurrentUser(), authMode: "demo" } : null);
  const [authMode, setAuthMode] = useState(() => getCurrentUser() ? "demo" : null);
  const [loading, setLoading] = useState(true);

  const clearBackendSession = useCallback(() => {
    setAccessToken(null);
    setUser((current) => current?.authMode === "backend" ? null : current);
    setAuthMode((current) => current === "backend" ? null : current);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(clearBackendSession);
    let active = true;
    const restore = async () => {
      const token = getAccessToken();
      if (!token) {
        if (active) setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await apiRequest("/auth/me");
        if (active) {
          setUser(publicUser(response.data));
          setAuthMode("backend");
        }
      } catch {
        setAccessToken(null);
        if (active) {
          setUser(null);
          setAuthMode(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    restore();
    const authChanged = (event) => {
      const demoUser = event.detail || getCurrentUser();
      setUser(demoUser ? { ...demoUser, authMode: "demo" } : null);
      setAuthMode(demoUser ? "demo" : null);
    };
    window.addEventListener("sevana_auth_changed", authChanged);
    return () => {
      active = false;
      setUnauthorizedHandler(null);
      window.removeEventListener("sevana_auth_changed", authChanged);
    };
  }, [clearBackendSession]);

  const authenticate = async (path, payload) => {
    setLoading(true);
    logoutUser();
    setAccessToken(null);
    setUser(null);
    setAuthMode(null);
    try {
      const response = await apiRequest(path, { method: "POST", body: payload });
      if (!response?.data?.accessToken) throw new Error("The Sevana API did not return a valid sign-in session.");
      setAccessToken(response.data.accessToken);
      const identity = await apiRequest("/auth/me");
      if (!identity?.data?.id) throw new Error("The Sevana API did not return a valid user profile.");
      const next = publicUser(identity.data);
      setUser(next);
      setAuthMode("backend");
      return next;
    } catch (error) {
      setAccessToken(null);
      setUser(null);
      setAuthMode(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = (data) => authenticate("/auth/register", data);
  const login = (email, password) => authenticate("/auth/login", { email, password });
  const loginDemo = (email, password) => {
    setAccessToken(null);
    const demoUser = loginUser(email, password);
    setUser({ ...demoUser, authMode: "demo" });
    setAuthMode("demo");
    return demoUser;
  };
  const logout = () => {
    setAccessToken(null);
    logoutUser();
    setUser(null);
    setAuthMode(null);
  };

  const demoAction = (action) => (...args) => {
    if (authMode !== "demo" || !user) return null;
    const next = action(user.id, ...args);
    const current = getCurrentUser();
    if (current) setUser({ ...current, authMode: "demo" });
    return next;
  };
  const value = {
    user,
    authMode,
    isAuthenticated: Boolean(user) && !loading,
    loading,
    register,
    login,
    loginDemo,
    logout,
    updateProfile: (updates) => authMode === "demo" && user ? updateUserProfile(user.id, updates) : null,
    addXP: demoAction((id, amount) => awardUserXP(id, amount)),
    onCampOrganized: demoAction((id, campId) => recordUserCampOrganized(id, campId)),
    onCampJoined: demoAction((id, data) => recordUserCampJoined(id, data)),
    onDonation: demoAction((id, data) => recordUserDonation(id, data)),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
