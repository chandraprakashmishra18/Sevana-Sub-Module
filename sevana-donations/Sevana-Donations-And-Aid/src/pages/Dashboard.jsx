import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCampaigns } from "../services/campaignService";
import { getDonationHistory } from "../services/donationService";
import "./Dashboard.css";

const roles = ["Individual / Donor", "Volunteer", "Organization", "Platform Admin"];
const readRole = () => localStorage.getItem("sevana_demo_dashboard_role") || roles[0];

export default function Dashboard() {
  const [role, setRole] = useState(readRole);
  const [notice, setNotice] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  useEffect(() => { getAllCampaigns().then(setCampaigns).catch(() => setNotice("Campaign data could not be loaded.")); }, []);
  const donations = getDonationHistory();
  const setDemoRole = (value) => { localStorage.setItem("sevana_demo_dashboard_role", value); setRole(value); };
  const isAdmin = role === "Platform Admin";
  const isOrg = role === "Organization";
  const metrics = isAdmin
    ? [["Registered users", "2,840", "+12% this month"], ["Organizations", "126", "18 pending review"], ["Active campaigns", campaigns.length, "4 need moderation"], ["Recorded donations", `₹${(donations.reduce((n, d) => n + Number(d.amount || 0), 0) + 184500).toLocaleString("en-IN")}`, "Demo records"]]
    : isOrg
      ? [["Campaigns", campaigns.length, "Across all statuses"], ["Active campaigns", campaigns.length, "Accepting support"], ["Contributions", `₹${(donations.reduce((n, d) => n + Number(d.amount || 0), 0) + 68400).toLocaleString("en-IN")}`, "Recorded in demo"], ["Beneficiaries reached", "248", "Across recent initiatives"]]
      : [["My donations", donations.length, "Saved in this browser"], ["Total contributed", `₹${donations.reduce((n, d) => n + Number(d.amount || 0), 0).toLocaleString("en-IN")}`, "Demo contributions"], ["Camp registrations", "See Camps", "Your registrations are in Camps"], ["Volunteer activity", "Explore", "Find an opportunity"]];
  return <section className="workspace-dashboard"><div className="container">
    <div className="workspace-dashboard__top"><div><span className="workspace-dashboard__eyebrow">SEVANA WORKSPACE · SIMULATED DATA</span><h1>{isAdmin ? "Platform overview" : isOrg ? "Organization workspace" : "Your community dashboard"}</h1><p>Manage community support and follow activity across Sevana.</p></div>
    <label>Demo view <select value={role} onChange={e => setDemoRole(e.target.value)}>{roles.map(x => <option key={x}>{x}</option>)}</select></label></div>
    <div className="workspace-dashboard__notice">Demo dashboard — figures and actions here are illustrative and are not verified platform records.{notice && <span role="status"> {notice}</span>}</div>
    <div className="workspace-dashboard__metrics">{metrics.map(([label,value,hint])=><article className="workspace-dashboard__metric" key={label}><span>{label}</span><strong>{value}</strong><small>{hint}</small></article>)}</div>
    <div className="workspace-dashboard__columns"><section className="workspace-dashboard__panel"><h2>{isAdmin ? "Review queue" : isOrg ? "Campaign performance" : "Recommended campaigns"}</h2><div className="workspace-dashboard__list">{campaigns.slice(0,4).map(c=><article key={c.id}><div><strong>{c.title}</strong><small>{c.ngo} · {c.location}</small></div><span>{isAdmin ? "Review" : `₹${Number(c.raisedAmount).toLocaleString("en-IN")} raised`}</span></article>)}</div><Link className="workspace-dashboard__link" to="/campaigns">Browse all campaigns →</Link></section>
    <section className="workspace-dashboard__panel"><h2>Quick actions</h2><div className="workspace-dashboard__actions"><Link to="/campaigns">Explore campaigns</Link><Link to="/donate">Record a demo contribution</Link><a href="http://localhost:5174/camps">Explore camps ↗</a><Link to="/notifications">View notifications</Link>{isOrg&&<><Link to="/manage-campaigns">Create or manage campaigns</Link><Link to="/ngo-partners">Organization profile</Link></>}{isAdmin&&<button onClick={()=>setNotice("Review queue: open Campaign management to update demo campaign moderation status.")}>Open moderation queue</button>}</div><h2 className="workspace-dashboard__subhead">Recent activity</h2><p className="workspace-dashboard__muted">Your new contributions and campaign updates are stored locally in this browser.</p></section></div>
  </div></section>;
}
