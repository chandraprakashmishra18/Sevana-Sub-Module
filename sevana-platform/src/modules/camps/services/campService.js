import mockCamps from "../data/mockCamps";
import { readRegistrations, normalizeRegistration, holdsSlot } from "../utils/registrationModel";

const STORAGE_KEY = "sevana_camps_created";
const OVERRIDE_KEY = "sevana_camps_overrides";

function getCreatedCamps() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}
function getOverrides() {
  try {
    return JSON.parse(localStorage.getItem(OVERRIDE_KEY) || "[]");
  } catch {
    return [];
  }
}

// The "database rows" of the demo: created camps + seeded camps with any saved edits.
function loadRawCamps() {
  const byId = new Map(getOverrides().map((camp) => [camp.id, camp]));
  return [...getCreatedCamps(), ...mockCamps.map((camp) => byId.get(camp.id) || camp)];
}

// Public pages show live slot counts: seeded "filled" + real saved registrations.
function withLiveSlots(camp) {
  const taken = readRegistrations()
    .filter((r) => r.campId === camp.id && holdsSlot(r))
    .map(normalizeRegistration);
  const add = (slots, role) =>
    slots ? { ...slots, filled: (slots.filled || 0) + taken.filter((r) => r.role === role).length } : slots;
  return {
    ...camp,
    workerSlots: add(camp.workerSlots, "VOLUNTEER"),
    attendeeSlots: add(camp.attendeeSlots, "BENEFICIARY"),
  };
}

// TEAMMATE: replace the body of each function with a real fetch() call,
// keeping the same function name and return shape.

export async function getAllCamps() {
  return loadRawCamps().map(withLiveSlots);
}

export async function getCampById(id) {
  const found = loadRawCamps().find((c) => c.id === id);
  return found ? withLiveSlots(found) : null;
}

// Same camp without live counts - use this when you need the stored values to edit them.
export function getCampRaw(id) {
  return loadRawCamps().find((c) => c.id === id) || null;
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

// Merges `patch` into the stored camp. Pass only the fields that change.
export function updateCamp(patch) {
  const created = getCreatedCamps();
  const createdIndex = created.findIndex((item) => item.id === patch.id);
  if (createdIndex >= 0) {
    created[createdIndex] = { ...created[createdIndex], ...patch };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(created));
    return created[createdIndex];
  }

  const base = mockCamps.find((item) => item.id === patch.id);
  if (!base) return null;
  const overrides = getOverrides();
  const index = overrides.findIndex((item) => item.id === patch.id);
  const next = { ...(index >= 0 ? overrides[index] : base), ...patch };
  if (index >= 0) overrides[index] = next;
  else overrides.unshift(next);
  localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides));
  return next;
}
