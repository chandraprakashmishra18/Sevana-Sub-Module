// Browser-only organization submissions and moderation are disabled.
export function getOrganizationSubmissions() {
  throw new Error("Organization submissions are stored on the backend; use getMyOrganizations().");
}

export function submitOrganization() {
  throw new Error("Use the authenticated organization registration API.");
}

export function setOrganizationStatus() {
  throw new Error("Organization verification requires an authorized backend moderation operation.");
}
