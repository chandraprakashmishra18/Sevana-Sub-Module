import mockNGOs from "../data/mockNGOs";

export async function getAllNGOs() {
  return Promise.resolve(mockNGOs);
}

export async function getNGOById(id) {
  const found = mockNGOs.find((n) => n.id === id);
  return Promise.resolve(found || null);
}