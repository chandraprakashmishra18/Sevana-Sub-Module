import { useEffect, useState } from "react";
import useCountUp from "../hooks/useCountUp";
import { getAllCampaigns } from "../services/campaignService";
import { getDisbursementsByCampaign } from "../services/donationService";
import { isCampaignPublic } from "../utils/campaignRules";
import "./ImpactTransparency.css";

function AnimatedStat({ value, label, prefix = "" }) {
  const count = useCountUp(value, 1600, true);
  return <div className="impact-page__stat"><p className="impact-page__stat-value">{prefix}{count.toLocaleString("en-IN")}</p><p className="impact-page__stat-label">{label}</p></div>;
}

export default function ImpactTransparency() {
  const [state, setState] = useState({ loading: true, campaigns: [], disbursements: [], error: "" });
  useEffect(() => {
    let active = true;
    getAllCampaigns().then(async (rows) => {
      const campaigns = rows.filter(isCampaignPublic);
      const groups = await Promise.all(campaigns.map(async (campaign) => (await getDisbursementsByCampaign(campaign.id)).map((entry) => ({ ...entry, campaignId: campaign.id }))));
      if (active) setState({ loading: false, campaigns, disbursements: groups.flat(), error: "" });
    }).catch((error) => { if (active) setState({ loading: false, campaigns: [], disbursements: [], error: error.message || "Unable to load impact records." }); });
    return () => { active = false; };
  }, []);
  if (state.loading) return <section className="impact-page"><div className="container"><p role="status">Loading verified impact records…</p></div></section>;
  const raised = state.campaigns.reduce((sum, campaign) => sum + Number(campaign.raisedAmount || 0), 0);
  const donors = state.campaigns.reduce((sum, campaign) => sum + Number(campaign.donorCount || 0), 0);
  const organizationCount = new Set(state.campaigns.map((campaign) => campaign.organizationId).filter(Boolean)).size;
  return <section className="impact-page"><div className="container"><div className="impact-page__header"><h1>Impact and Transparency</h1><p>Confirmed donation totals and published disbursement records supplied by the backend.</p></div>
    {state.error && <p role="alert">{state.error}</p>}
    {!state.error && <><div className="impact-page__stats-grid"><AnimatedStat value={raised} prefix="₹" label="Confirmed funds raised"/><AnimatedStat value={donors} label="Successful donations recorded"/><AnimatedStat value={state.campaigns.length} label="Active campaigns"/><AnimatedStat value={organizationCount} label="Organizations represented"/></div>
    <div className="impact-page__section"><h2>Published disbursement records</h2>{state.disbursements.length ? <div className="impact-page__disbursement-grid">{state.disbursements.map((item) => { const campaign = state.campaigns.find((entry) => entry.id === item.campaignId); return <article className="impact-proof-card" key={item.id}><div className="impact-proof-card__body"><p className="impact-proof-card__campaign">{campaign?.title || "Campaign"}</p><p className="impact-proof-card__desc">{item.description}</p><div className="impact-proof-card__footer"><span>{new Date(item.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span><strong>{item.amount == null ? "Amount not disclosed" : `₹${Number(item.amount).toLocaleString("en-IN")}`}</strong></div></div></article>; })}</div> : <p>No public disbursement records are available.</p>}</div><p className="impact-page__section-sub">Only successful donations contribute to confirmed totals. Donation intents remain pending until a configured payment provider confirms settlement.</p></>}
  </div></section>;
}
