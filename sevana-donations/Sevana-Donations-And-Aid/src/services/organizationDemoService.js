const KEY = "sevana_organization_submissions";
export const getOrganizationSubmissions = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };
export function submitOrganization(data) { const record = { ...data, id: `org-${Date.now()}`, status: "pending", submittedAt: new Date().toISOString() }; localStorage.setItem(KEY, JSON.stringify([record, ...getOrganizationSubmissions()])); return record; }
export function setOrganizationStatus(id, status) { const records = getOrganizationSubmissions().map((item) => item.id === id ? { ...item, status } : item); localStorage.setItem(KEY, JSON.stringify(records)); return records.find((item) => item.id === id); }
