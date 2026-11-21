import { apiRequest } from "../api/client";

const TYPES = { NGO: "NGO", School: "SCHOOL", College: "COLLEGE", "NSS/NCC": "NSS", "Community organization": "COMMUNITY_GROUP", Other: "OTHER" };
export async function createOrganization(data) {
  const response = await apiRequest("/organizations", { method: "POST", body: {
    name: data.name, type: TYPES[data.type] || data.type || "OTHER", description: data.mission,
    email: data.email || undefined, phone: data.phone || undefined, address: data.location || undefined, city: data.city || undefined, state: data.state || undefined,
  } });
  return response.data;
}
export async function updateOrganization(id, data) { const response = await apiRequest(`/organizations/${encodeURIComponent(id)}`, { method: "PATCH", body: data }); return response.data; }
export async function getMyOrganizations() { const response = await apiRequest("/organizations/mine"); return response.data || []; }
export async function getOrganizationCampaigns(id) { const response = await apiRequest(`/organizations/${encodeURIComponent(id)}/campaigns`); return response.data || []; }
export async function getOrganizationDonations(id) { const response = await apiRequest(`/organizations/${encodeURIComponent(id)}/donations`); return response.data || []; }
