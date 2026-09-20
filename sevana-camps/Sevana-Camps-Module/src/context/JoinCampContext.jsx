import { useState } from "react";
import { JoinCampContext } from "./joinCampContextInstance";

export function JoinCampProvider({ children, initialRole, campId }) {
  const [step, setStep] = useState(1);
  const [joinData, setJoinData] = useState({
    campId: campId || null,
    role: initialRole || "attendee",
    fullName: "",
    email: "",
    phone: "",
    // Worker-specific
    skillOrProfession: "",
    availability: "",
    experience: "",
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