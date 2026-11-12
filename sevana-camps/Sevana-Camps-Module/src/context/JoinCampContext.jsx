import { useState } from "react";
import { JoinCampContext } from "./joinCampContextInstance";
import { getCurrentUser } from "../services/authService";

export function JoinCampProvider({ children, initialRole, campId }) {
  const currentUser = getCurrentUser();
  const [step, setStep] = useState(1);
  const [joinData, setJoinData] = useState({
    campId: campId || null,
    role: initialRole || (currentUser?.roleType === "doctor" || currentUser?.roleType === "teacher" || currentUser?.roleType === "volunteer" ? "worker" : "attendee"),
    fullName: currentUser ? currentUser.name : "",
    email: currentUser ? currentUser.email : "",
    phone: currentUser ? currentUser.phone : "",
    // Worker-specific
    skillOrProfession: currentUser ? currentUser.role : "",
    availability: "Full Day",
    experience: currentUser?.organization ? `Associated with ${currentUser.organization}` : "",
    // Attendee-specific
    reasonForVisit: "",
    ageGroup: "",
  });

  const updateJoinData = (fields) => {
    setJoinData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <JoinCampContext.Provider
      value={{ step, setStep, nextStep, prevStep, joinData, updateJoinData }}
    >
      {children}
    </JoinCampContext.Provider>
  );
}
