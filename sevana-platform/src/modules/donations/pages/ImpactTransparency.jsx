import { useEffect, useState } from "react";
import { getAllCampaigns } from "../services/campaignService";
import { getAllCamps } from "../../camps/services/campService";
import "./ImpactTransparency.css";

function ImpactTransparency() {
  const [campaigns,setCampaigns]=useState([]); const [camps,setCamps]=useState([]); const [error,setError]=useState("");
  useEffect(()=>{Promise.all([getAllCampaigns(),getAllCamps()]).then(([a,b])=>{setCampaigns(a);setCamps(b)}).catch(e=>setError(e.message||"Could not load Sevana listings."))},[]);
  return <section className="impact-page"><div className="container"><div className="impact-page__header"><h1>Impact & Transparency</h1><p>Sevana lists active campaigns and published camps from the backend. Payment totals and disbursement proofs will appear after verified payment and distribution reporting is available.</p></div>{error&&<p role="alert">{error}</p>}<div className="impact-page__stats-grid"><div className="impact-page__stat"><p className="impact-page__stat-value">{campaigns.length}</p><p className="impact-page__stat-label">Active campaigns</p></div><div className="impact-page__stat"><p className="impact-page__stat-value">{camps.length}</p><p className="impact-page__stat-label">Published camps</p></div><div className="impact-page__stat"><p className="impact-page__stat-value">—</p><p className="impact-page__stat-label">Verified funds raised</p></div><div className="impact-page__stat"><p className="impact-page__stat-value">—</p><p className="impact-page__stat-label">Verified disbursements</p></div></div><div className="impact-page__section"><h2>Payment verification</h2><p>Donation requests remain pending until a payment provider confirms them. The current MVP has no payment gateway or public disbursement-proof endpoint, so it does not report unverified payment or spending figures.</p></div></div></section>;
}

export default ImpactTransparency;
