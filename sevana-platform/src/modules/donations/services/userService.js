import { apiRequest } from "../api/client";
export async function getMyProfile() { const response = await apiRequest("/users/me"); return response.data; }
export async function updateMyProfile(data) { const response = await apiRequest("/users/me", { method: "PATCH", body: data }); return response.data; }
export async function getMyActivity() { const response = await apiRequest("/users/me/activity"); return response.data || []; }
export async function getPublicProfile(id) { const response = await apiRequest(`/users/${encodeURIComponent(id)}`); return response.data; }
export async function getLeaderboard() { const response = await apiRequest("/users/leaderboard"); return response.data || []; }
