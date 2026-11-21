import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCampaigns } from "../modules/donations/services/campaignService";
import { getAllCamps } from "../modules/camps/services/campService";

export default function Analytics() {
  const [data, setData] = useState({ campaigns: [], camps: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    Promise.all([getAllCampaigns(), getAllCamps()]).then(([campaigns, camps]) => { if (active) setData({ campaigns, camps }); })
      .catch((e) => { if (active) setError(e.message || "Unable to retrieve public activity."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const raised = data.campaigns.reduce((sum, campaign) => sum + Number(campaign.raisedAmount || 0), 0);
  const successfulDonors = data.campaigns.reduce((sum, campaign) => sum + Number(campaign.donorCount || 0), 0);
  return <section className="unified-workspace"><div className="container"><header className="unified-workspace__header"><div><span className="unified-workspace__eyebrow">PUBLIC ACTIVITY</span><h1>Community activity</h1><p>Figures reflect published records returned by the backend.</p></div><Link to="/campaigns">Browse campaigns</Link></header>
    {error && <p role="alert" className="unified-workspace__notice">{error}</p>}{loading ? <p role="status">Loading activity…</p> : <><div className="unified-workspace__grid">{[["Active campaigns", data.campaigns.length], ["Camps", data.camps.length], ["Recorded successful donations", successfulDonors], ["Confirmed funds raised", `₹${raised.toLocaleString("en-IN")}`]].map(([label, value]) => <article className="unified-workspace__card" key={label}><span>{label}</span><strong>{value}</strong><small>From backend campaign records</small></article>)}</div><p className="unified-workspace__notice">Beneficiary reach and attendance totals are not included because the backend does not expose a public aggregate endpoint for them.</p></>}</div></section>;
}
