import { createContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  registerUser,
  loginUser,
  logoutUser,
  updateUserProfile,
  awardUserXP,
  recordUserCampOrganized,
  recordUserCampJoined,
  recordUserDonation,
} from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      setUser(e.detail || getCurrentUser());
    };
    window.addEventListener("sevana_auth_changed", handler);
    window.addEventListener("storage", (e) => {
      if (e.key === "sevana_auth_user") {
        setUser(getCurrentUser());
      }
    });
    return () => {
      window.removeEventListener("sevana_auth_changed", handler);
    };
  }, []);

  const register = async (userData) => {
    setLoading(true);
    try {
      const newUser = registerUser(userData);
      setUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = loginUser(email, password);
      setUser(loggedUser);
      return loggedUser;
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
    const updated = updateUserProfile(user.id, updates);
    setUser(updated);
    return updated;
  };

  const addXP = (amount, reason) => {
    if (!user) return null;
    const updated = awardUserXP(user.id, amount, reason);
    setUser(updated);
    return updated;
  };

  const onCampOrganized = (campId) => {
    if (!user) return null;
    const updated = recordUserCampOrganized(user.id, campId);
    setUser(updated);
    return updated;
  };

  const onCampJoined = (campAction) => {
    if (!user) return null;
    const updated = recordUserCampJoined(user.id, campAction);
    setUser(updated);
    return updated;
  };

  const onDonation = (donationAction) => {
    if (!user) return null;
    const updated = recordUserDonation(user.id, donationAction);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        register,
        login,
        logout,
        updateProfile,
        addXP,
        onCampOrganized,
        onCampJoined,
        onDonation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
