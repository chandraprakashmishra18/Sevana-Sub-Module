import { getCachedBackendUser } from "../api/client";

// AuthContext owns the backend session. This helper is only for pre-filling
// legacy form contexts and never falls back to local/demo account data.
export function getCurrentUser() {
  return getCachedBackendUser();
}
