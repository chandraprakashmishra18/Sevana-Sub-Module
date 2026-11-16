import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./useAuth";
import { apiRequest } from "./apiClient";
import { getAllCampaigns } from "../modules/donations/services/campaignService";
import { getDonationHistory } from "../modules/donations/services/donationService";
import { getAllCamps } from "../modules/camps/services/campService";

const DASHBOARD_CACHE_TTL_MS = 15_000;
const dashboardCache = new Map();
const inFlightDashboards = new Map();

function loadOrganizationDashboard(organizationId, userId) {
  const cacheKey = `${userId || "unknown-user"}:${organizationId}`;
  const cached = dashboardCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.result);
  if (inFlightDashboards.has(cacheKey)) return inFlightDashboards.get(cacheKey);

  const requests = [
    {
      key: "campaigns",
      label: "Campaigns",
      path: `/campaigns/mine?organizationId=${encodeURIComponent(organizationId)}`,
      run: () => getAllCampaigns({ organizationId })
    },
    {
      key: "camps",
      label: "Camps",
      path: `/camps/mine?organizationId=${encodeURIComponent(organizationId)}`,
      run: () => getAllCamps({ organizationId })
    },
    {
      key: "donations",
      label: "Donations",
      path: `/donations?organizationId=${encodeURIComponent(organizationId)}`,
      run: () => getDonationHistory({ organizationId })
    },
    {
      key: "aidRequests",
      label: "Aid requests",
      path: `/aid-requests?organizationId=${encodeURIComponent(organizationId)}`,
      run: async () => (await apiRequest(`/aid-requests?organizationId=${encodeURIComponent(organizationId)}`))?.data || []
    },
    {
      key: "distributions",
      label: "Distributions",
      path: `/distributions?organizationId=${encodeURIComponent(organizationId)}`,
      run: async () => (await apiRequest(`/distributions?organizationId=${encodeURIComponent(organizationId)}`))?.data || []
    }
  ];

  const request = Promise.all(requests.map(async (item) => {
    try {
      return { ...item, value: await item.run() };
    } catch (error) {
      return { ...item, error };
    }
  })).then((results) => {
    const data = {};
    const errors = {};
    results.forEach((result) => {
      data[result.key] = result.error ? null : result.value;
      if (result.error) {
        const status = result.error.status ? `HTTP ${result.error.status}` : "request failed";
        errors[result.key] = `${result.label} (GET ${result.path}): ${status} — ${result.error.message}`;
      }
    });

    const result = { data, errors };
    if (Object.keys(errors).length === 0) {
      dashboardCache.set(cacheKey, { result, expiresAt: Date.now() + DASHBOARD_CACHE_TTL_MS });
      if (dashboardCache.size > 20) dashboardCache.delete(dashboardCache.keys().next().value);
    }
    return result;
  }).finally(() => {
    inFlightDashboards.delete(cacheKey);
  });

  inFlightDashboards.set(cacheKey, request);
  return request;
}

const emptyData = { campaigns: [], camps: [], donations: [], aidRequests: [], distributions: [] };

export default function OrganizationDashboard() {
  const { user, organizations, activeOrganization, setActiveOrganizationId } = useAuth();
  const [data, setData] = useState(emptyData);
  const [requestErrors, setRequestErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeOrganization?.id) {
      setLoading(false);
      setData(emptyData);
      setRequestErrors({});
      return undefined;
    }

    let active = true;
    setLoading(true);
    const organizationId = activeOrganization.id;
    loadOrganizationDashboard(organizationId, user?.id)
      .then((result) => {
        if (!active) return;
        setData(result.data);
        setRequestErrors(result.errors);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [activeOrganization?.id, user?.id]);

  if (!activeOrganization) return <section className="unified-workspace"><div className="container"><h1>No organization membership found</h1><p>Register an organization with this account or ask an organization owner to add you.</p><Link to="/register?type=organization">Register an organization</Link></div></section>;

  const stats = [
    ["campaigns", "Campaigns", "Your organization's campaigns and drafts"],
    ["camps", "Camps", "Your organization's camps and drafts"],
    ["donations", "Donations", "Donations to this organization's campaigns"],
    ["aidRequests", "Aid requests", "Requests submitted for this organization"],
    ["distributions", "Distributions", "Recorded organization distributions"]
  ];
  const failureMessages = Object.values(requestErrors);

  return <section className="unified-workspace"><div className="container">
    <header className="unified-workspace__header"><div><span className="unified-workspace__eyebrow">ORGANIZATION WORKSPACE</span><h1>{activeOrganization.name}</h1><p>{activeOrganization.type} · Verification: <strong>{activeOrganization.verificationStatus}</strong></p></div>
      {organizations.length > 1 && <label>Organization <select value={activeOrganization.id} onChange={e=>setActiveOrganizationId(e.target.value)}>{organizations.map(org=><option key={org.id} value={org.id}>{org.name}</option>)}</select></label>}
    </header>
    {failureMessages.length > 0 && <div role="alert"><p>Some organization data could not be loaded:</p><ul>{failureMessages.map((failure)=><li key={failure}>{failure}</li>)}</ul></div>}
    {loading ? <p role="status">Loading organization data…</p> : <div className="unified-workspace__grid">{stats.map(([key,label,note])=><article className="unified-workspace__card" key={key}><span>{label}</span><strong>{requestErrors[key] ? "Unavailable" : data[key].length}</strong><small>{note}</small></article>)}</div>}
    <div className="unified-workspace__columns"><section className="unified-workspace__panel"><h2>Campaigns, donations & aid</h2><div className="unified-workspace__actions"><Link to="/manage-campaigns">Create and manage campaigns</Link><Link to="/impact">Open impact reporting</Link></div><p>Successful payment totals are not shown until a payment provider is connected.</p></section><section className="unified-workspace__panel"><h2>Medical & educational camps</h2><div className="unified-workspace__actions"><Link to="/organize">Create a camp draft</Link><Link to="/manage-camps">Manage camps and attendance</Link><Link to="/camps">Browse published camps</Link></div></section></div>
    <section className="unified-workspace__panel" style={{marginTop:18}}><h2>Donation records</h2>{requestErrors.donations ? <p>Donation records are unavailable until the request succeeds.</p> : data.donations.length ? data.donations.slice(0,8).map(d=><div className="unified-workspace__row" key={d.id}><div><strong>{d.isAnonymous ? "Anonymous donor" : d.donorName || "Donor"}</strong><small>{d.campaign?.title || "Unlinked donation"} · {d.status}</small></div><strong>{d.amount ? `${d.currency} ${Number(d.amount).toLocaleString("en-IN")}` : d.type}</strong></div>) : <p>No donation records available.</p>}</section>
  </div></section>;
}
