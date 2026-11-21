import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrganizations } from "../modules/donations/services/organizationService";
import { getOrganizationCampaigns } from "../modules/donations/services/campaignService";
import { getOrganizationCamps } from "../modules/camps/services/campService";

export default function OrganizationDashboard() {
  const [items, setItems] = useState({ organizations: [], campaigns: [], camps: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    Promise.all([getMyOrganizations(), getOrganizationCampaigns(), getOrganizationCamps()])
      .then(([organizations, campaigns, camps]) => { if (active) setItems({ organizations, campaigns, camps }); })
      .catch((e) => { if (active) setError(e.message || "Unable to load organization data."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return <section className="unified-workspace"><div className="container"><header className="unified-workspace__header"><div><span className="unified-workspace__eyebrow">ORGANIZATION WORKSPACE</span><h1>Coordinate community work</h1><p>Organization, campaign and camp records loaded from Sevana.</p></div><Link className="unified-workspace__primary" to="/register-organization">Register organization</Link></header>
    {error && <p role="alert" className="unified-workspace__notice">{error}</p>}{loading ? <p role="status">Loading organization data…</p> : items.organizations.length === 0 ? <section className="unified-workspace__panel"><h2>No organization access yet</h2><p>Register an organization to create campaigns and manage camps. Verification is handled by the platform.</p><Link to="/register-organization">Start organization registration</Link></section> : <><div className="unified-workspace__grid">{items.organizations.map((org) => <article className="unified-workspace__card" key={org.id}><span>{org.name}</span><strong>{String(org.verificationStatus || "PENDING").toLowerCase()}</strong><small>{org.type}</small></article>)}<article className="unified-workspace__card"><span>Campaigns</span><strong>{items.campaigns.length}</strong><small>Organization campaigns</small></article><article className="unified-workspace__card"><span>Camps</span><strong>{items.camps.length}</strong><small>Organization camps</small></article></div><div className="unified-workspace__columns"><section className="unified-workspace__panel"><h2>Donations & Aid</h2><div className="unified-workspace__actions"><Link to="/manage-campaigns">Create and manage campaigns</Link><Link to="/impact">Impact reporting</Link></div></section><section className="unified-workspace__panel"><h2>Educational & Medical Camps</h2><div className="unified-workspace__actions"><Link to="/organize">Create a camp</Link><Link to="/manage-camps">Manage registrations and attendance</Link></div></section></div></>}</div></section>;
}
