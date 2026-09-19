import mockCamps from "../data/mockCamps";

// TEAMMATE: replace the body of each function with a real fetch() call,
// keeping the same function name and return shape.

export async function getAllCamps() {
  return Promise.resolve(mockCamps);
}

export async function getCampById(id) {
  const found = mockCamps.find((c) => c.id === id);
  return Promise.resolve(found || null);
}

export async function getUpcomingCamps() {
  return Promise.resolve(mockCamps.filter((c) => c.status === "upcoming"));
}

export async function getPastCamps() {
  return Promise.resolve(mockCamps.filter((c) => c.status === "past"));
}