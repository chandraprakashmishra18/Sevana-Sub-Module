import { useContext } from "react";
import { AuthContext } from "./AuthContextInstance";
export function useAuth(){const value=useContext(AuthContext);if(!value)throw new Error("useAuth must be used inside the Sevana app");return value;}
