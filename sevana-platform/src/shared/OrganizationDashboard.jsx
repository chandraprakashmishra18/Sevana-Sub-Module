import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./useAuth";
import { apiRequest } from "./apiClient";
import { getAllCampaigns } from "../modules/donations/services/campaignService";
import { getDonationHistory } from "../modules/donations/services/donationService";
import { getAllCamps } from "../modules/camps/services/campService";

export default function OrganizationDashboard() {
  const { organizations, activeOrganization, setActiveOrganizationId } = useAuth();
  const [data, setData] = useState({ campaigns: [], camps: [], donations: [], aidRequests: [], distributions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!activeOrganization?.id) return;
    let active = true;
    setLoading(true); setError("");
    const organizationId = activeOrganization.id;
    const capture = (promise) => promise.then((value) => ({ value }), (failure) => ({ failure }));
    Promise.all([
      capture(getAllCampaigns({ organizationId })),
      capture(getAllCamps({ organizationId })),
      capture(getDonationHistory({ organizationId })),
      capture(apiRequest(`/aid-requests?organizationId=${encodeURIComponent(organizationId)}`).then(r => r.data || [])),
      capture(apiRequest(`/distributions?organizationId=${encodeURIComponent(organizationId)}`).then(r => r.data || []))
    ]).then((results) => {
      if (!active) return;
      const [campaigns,camps,donations,aidRequests,distributions] = results.map(result => result.value || []);
      setData({ campaigns,camps,donations,aidRequests,distributions });
      const failures = results.filter(result => result.failure).map(result => result.failure.message);
      setError(failures.length ? `Some organization data could not be loaded: ${failures.join("; ")}` : "");
    })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [activeOrganization?.id]);

  if (!activeOrganization) return <section className="unified-workspace"><div className="container"><h1>No organization membership found</h1><p>Register an organization with this account or ask an organization owner to add you.</p><Link to="/register?type=organization">Register an organization</Link></div></section>;

  const stats = [
    ["Campaigns", data.campaigns.length, "Your organization's campaigns and drafts"],
    ["Camps", data.camps.length, "Your organization's camps and drafts"],
    ["Donations", data.donations.length, "Donations to this organization's campaigns"],
    ["Aid requests", data.aidRequests.length, "Requests submitted for this organization"],
    ["Distributions", data.distributions.length, "Recorded organization distributions"]
  ];

  return <section className="unified-workspace"><div className="container">
    <header className="unified-workspace__header"><div><span className="unified-workspace__eyebrow">ORGANIZATION WORKSPACE</span><h1>{activeOrganization.name}</h1><p>{activeOrganization.type} · Verification: <strong>{activeOrganization.verificationStatus}</strong></p></div>
      {organizations.length > 1 && <label>Organization <select value={activeOrganization.id} onChange={e=>setActiveOrganizationId(e.target.value)}>{organizations.map(org=><option key={org.id} value={org.id}>{org.name}</option>)}</select></label>}
    </header>
    {error && <p role="alert">{error}</p>}
    {loading ? <p role="status">Loading organization data…</p> : <div className="unified-workspace__grid">{stats.map(([label,value,note])=><article className="unified-workspace__card" key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>)}</div>}
    <div className="unified-workspace__columns"><section className="unified-workspace__panel"><h2>Campaigns, donations & aid</h2><div className="unified-workspace__actions"><Link to="/manage-campaigns">Create and manage campaigns</Link><Link to="/impact">Open impact reporting</Link></div><p>Successful payment totals are not shown until a payment provider is connected.</p></section><section className="unified-workspace__panel"><h2>Medical & educational camps</h2><div className="unified-workspace__actions"><Link to="/organize">Create a camp draft</Link><Link to="/manage-camps">Manage camps and attendance</Link><Link to="/camps">Browse published camps</Link></div></section></div>
    <section className="unified-workspace__panel" style={{marginTop:18}}><h2>Donation records</h2>{data.donations.length ? data.donations.slice(0,8).map(d=><div className="unified-workspace__row" key={d.id}><div><strong>{d.isAnonymous ? "Anonymous donor" : d.donorName || "Donor"}</strong><small>{d.campaign?.title || "Unlinked donation"} · {d.status}</small></div><strong>{d.amount ? `${d.currency} ${Number(d.amount).toLocaleString("en-IN")}` : d.type}</strong></div>) : <p>No donation records available.</p>}</section>
  </div></section>;
}
