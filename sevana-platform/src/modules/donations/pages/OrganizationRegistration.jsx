import { useState } from "react";
import { Link } from "react-router-dom";
import { createOrganization } from "../services/organizationService";
import { useAuth } from "../context/useAuth";
import "./Dashboard.css";
import "./Workflow.css";

export default function OrganizationRegistration() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", type: "NGO", email: user?.email || "", phone: "", location: "", mission: "" });
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const send = async (event) => {
    event.preventDefault(); setSaving(true); setError("");
    try { const organization = await createOrganization(form); setSubmitted(organization); }
    catch (requestError) { setError(requestError.message || "Unable to create organization."); }
    finally { setSaving(false); }
  };
  return <section className="workspace-dashboard"><div className="container"><div className="workspace-dashboard__top"><div><span className="workspace-dashboard__eyebrow">ORGANIZATION ONBOARDING</span><h1>Register your organization</h1><p>Organization records are stored in Sevana and start with pending verification.</p></div></div><div className="workspace-dashboard__notice">Verification status is assigned by the backend. No documents are uploaded by this form.</div>{submitted ? <section className="workspace-dashboard__panel"><h2>Organization submitted</h2><p>{submitted.name} is saved with status {submitted.verificationStatus}.</p><Link className="workspace-dashboard__link" to="/organization">Open organization workspace →</Link></section> : <form className="workspace-dashboard__panel" onSubmit={send}><div className="campaign-manager__form"><label>Organization name<input required minLength="2" maxLength="180" value={form.name} onChange={(e) => change("name", e.target.value)} /></label><label>Organization type<select value={form.type} onChange={(e) => change("type", e.target.value)}>{["NGO", "School", "College", "NSS/NCC", "Company", "Community organization", "Other"].map((value) => <option key={value}>{value}</option>)}</select></label><label>Contact email<input type="email" value={form.email} onChange={(e) => change("email", e.target.value)} /></label><label>Contact phone<input type="tel" value={form.phone} onChange={(e) => change("phone", e.target.value)} /></label><label className="campaign-manager__wide">Address / city<input value={form.location} onChange={(e) => change("location", e.target.value)} /></label><label className="campaign-manager__wide">Mission<textarea required minLength="20" maxLength="10000" rows="4" value={form.mission} onChange={(e) => change("mission", e.target.value)} /></label></div>{error && <p role="alert">{error}</p>}<button className="workspace-dashboard__primary" disabled={saving} type="submit">{saving ? "Saving..." : "Submit organization"}</button></form>}</div></section>;
}
