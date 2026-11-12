import mockCamps from "../data/mockCamps";

const STORAGE_KEY = "sevana_camps_created";
const OVERRIDE_KEY = "sevana_camps_overrides";

function getCreatedCamps() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}
function getOverrides() { try { return JSON.parse(localStorage.getItem(OVERRIDE_KEY) || "[]"); } catch { return []; } }

// TEAMMATE: replace the body of each function with a real fetch() call,
// keeping the same function name and return shape.

export async function getAllCamps() {
  const overrides = getOverrides(); const byId = new Map(overrides.map((camp) => [camp.id, camp]));
  return [...getCreatedCamps(), ...mockCamps.map((camp) => byId.get(camp.id) || camp)];
}

export async function getCampById(id) {
  const found = [...getCreatedCamps(), ...mockCamps].find((c) => c.id === id);
  return Promise.resolve(found || null);
}

export async function getUpcomingCamps() {
  return (await getAllCamps()).filter((c) => c.status === "upcoming");
}

export async function getPastCamps() {
  return (await getAllCamps()).filter((c) => c.status === "past");
}

export function saveCreatedCamp(camp) {
  const camps = getCreatedCamps();
  camps.unshift(camp);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(camps));
}

export function updateCamp(camp) {
  const created = getCreatedCamps(); const createdIndex = created.findIndex((item) => item.id === camp.id);
  if (createdIndex >= 0) { created[createdIndex] = { ...created[createdIndex], ...camp }; localStorage.setItem(STORAGE_KEY, JSON.stringify(created)); return created[createdIndex]; }
  const overrides = getOverrides(); const index = overrides.findIndex((item) => item.id === camp.id);
  if (index >= 0) overrides[index] = { ...overrides[index], ...camp }; else overrides.unshift(camp);
  localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides)); return camp;
}
