import { useContext } from "react";
import { JoinCampContext } from "./joinCampContextInstance";

export function useJoinCamp() {
  const context = useContext(JoinCampContext);
  if (!context) {
    throw new Error("useJoinCamp must be used within a JoinCampProvider");
  }
  return context;
}