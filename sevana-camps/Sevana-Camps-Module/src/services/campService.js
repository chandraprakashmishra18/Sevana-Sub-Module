import mockCamps from "../data/mockCamps";

const STORAGE_KEY = "sevana_camps_created";

function getCreatedCamps() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

// TEAMMATE: replace the body of each function with a real fetch() call,
// keeping the same function name and return shape.

export async function getAllCamps() {
  return [...getCreatedCamps(), ...mockCamps];
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
