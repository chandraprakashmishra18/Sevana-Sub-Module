import { createCamp } from "./campService";
import { getAllNGOs, getNGOById } from "../../donations/services/ngoService";

export async function getAllOrganizers() { return getAllNGOs(); }
export async function getOrganizerById(id) { return getNGOById(id); }
export async function submitNewCamp(campData) {
  try {
    const camp = await createCamp(campData);
    return { success: true, campId: camp.id, camp };
  } catch (error) { return { success: false, error: error.message || "Unable to save camp." }; }
}
