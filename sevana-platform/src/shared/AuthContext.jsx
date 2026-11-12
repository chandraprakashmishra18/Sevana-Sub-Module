import { createContext, useEffect, useState } from "react";
import {
  getCurrentUser, registerUser, loginUser, logoutUser, updateUserProfile,
  awardUserXP, recordUserCampOrganized, recordUserCampJoined, recordUserDonation,
} from "../modules/donations/services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const authChanged = (event) => setUser(event.detail || getCurrentUser());
    const storageChanged = (event) => { if (event.key === "sevana_auth_user") setUser(getCurrentUser()); };
    window.addEventListener("sevana_auth_changed", authChanged);
    window.addEventListener("storage", storageChanged);
    return () => { window.removeEventListener("sevana_auth_changed", authChanged); window.removeEventListener("storage", storageChanged); };
  }, []);
  const register = async (data) => { setLoading(true); try { const next = registerUser(data); setUser(next); return next; } finally { setLoading(false); } };
  const login = async (email, password) => { setLoading(true); try { const next = loginUser(email, password); setUser(next); return next; } finally { setLoading(false); } };
  const logout = () => { logoutUser(); setUser(null); };
  const updateProfile = (updates) => { if (!user) return null; const next = updateUserProfile(user.id, updates); setUser(next); return next; };
  const addXP = (amount, reason) => user ? (setUser(awardUserXP(user.id, amount, reason)), getCurrentUser()) : null;
  const onCampOrganized = (id) => user ? (setUser(recordUserCampOrganized(user.id, id)), getCurrentUser()) : null;
  const onCampJoined = (data) => user ? (setUser(recordUserCampJoined(user.id, data)), getCurrentUser()) : null;
  const onDonation = (data) => user ? (setUser(recordUserDonation(user.id, data)), getCurrentUser()) : null;
  return <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), loading, register, login, logout, updateProfile, addXP, onCampOrganized, onCampJoined, onDonation }}>{children}</AuthContext.Provider>;
}
