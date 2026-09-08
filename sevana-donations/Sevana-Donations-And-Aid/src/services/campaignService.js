import mockCampaigns from "../data/mockCampaigns";

// TEAMMATE: replace the body of each function below with a real fetch() call
// to your backend, keeping the same function name and return shape.
// Example real version:
// export async function getAllCampaigns() {
//   const res = await fetch(`${import.meta.env.VITE_API_URL}/campaigns`);
//   return res.json();
// }

export async function getAllCampaigns() {
  return Promise.resolve(mockCampaigns);
}

export async function getCampaignById(id) {
  const found = mockCampaigns.find((c) => c.id === id);
  return Promise.resolve(found || null);
}