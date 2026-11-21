import { apiRequest } from "../api/client";

export async function getAllNGOs() {
  const response = await apiRequest("/organizations");
  return (response.data || []).map((item) => ({ ...item, verified: item.verificationStatus === "VERIFIED", mission: item.description || "", location: [item.city, item.state].filter(Boolean).join(", "), campaignsRun: item._count?.campaigns || 0 }));
}

export async function getNGOById(id) {
  const response = await apiRequest(`/organizations/${encodeURIComponent(id)}`);
  const item = response.data;
  return item ? { ...item, verified: item.verificationStatus === "VERIFIED", mission: item.description || "", location: [item.city, item.state].filter(Boolean).join(", "), campaignsRun: item._count?.campaigns || 0 } : null;
}
