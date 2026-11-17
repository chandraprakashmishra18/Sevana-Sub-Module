import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./useAuth";
import { getAllCampaigns } from "../modules/donations/services/campaignService";
import { getDonationHistory } from "../modules/donations/services/donationService";
import { getAllCamps } from "../modules/camps/services/campService";

export default function Dashboard() {
  const { user, organizations } = useAuth();
  const [campaigns,setCampaigns]=useState([]); const [camps,setCamps]=useState([]); const [donations,setDonations]=useState([]);
  const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  useEffect(()=>{let active=true;Promise.all([getAllCampaigns(),getAllCamps(),getDonationHistory()]).then(([c,ca,d])=>{if(active){setCampaigns(c);setCamps(ca);setDonations(d);}}).catch(err=>{if(active)setError(err.message||"Could not load your Sevana data.")}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);
  const successfulDonations=donations.filter(d=>d.status==="SUCCESSFUL");
  return <section className="unified-workspace"><div className="container">
    <div className="unified-workspace__header"><div><span className="unified-workspace__eyebrow">YOUR SEVANA · ONE ACCOUNT</span><h1>Welcome, {user?.name?.split(" ")[0] || "back"}</h1><p>Discover community campaigns and camps, and review your donation records.</p></div><Link className="unified-workspace__primary" to="/campaigns">Find an initiative</Link></div>
    {error&&<p role="alert">{error}</p>}{loading?<p role="status">Loading your Sevana data…</p>:<><div className="unified-workspace__grid">{[["Donation records",donations.length,"Only your authenticated donations"],["Successful donations",successfulDonations.length,"Pending requests are not counted as paid"],["Published campaigns",campaigns.length,"Currently active campaigns"],["Published camps",camps.length,"Camps available to the community"]].map(([label,value,note])=><article className="unified-workspace__card" key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>)}</div><section className="unified-workspace__panel"><h2>Your donation records</h2>{donations.length?donations.map(d=><div className="unified-workspace__row" key={d.id}><div><strong>{d.campaign?.title||"Donation request"}</strong><small>{d.status} · {new Date(d.createdAt).toLocaleDateString()}</small></div><strong>{d.currency} {Number(d.amount||0).toLocaleString("en-IN")}</strong></div>):<p>No donation records yet. A donation request will appear here after submission.</p>}</section></>}
    <div className="unified-workspace__columns"><section className="unified-workspace__panel"><h2>Discover initiatives</h2><div className="unified-workspace__rows">{campaigns.slice(0,3).map(c=><div className="unified-workspace__row" key={c.id}><div><strong>{c.title}</strong><small>{c.ngo} · {c.location}</small></div><Link to={`/campaigns/${c.id}`}>View</Link></div>)}{camps.filter(c=>c.status==="upcoming").slice(0,3).map(c=><div className="unified-workspace__row" key={c.id}><div><strong>{c.title}</strong><small>{c.organizer} · {c.location}</small></div><Link to={`/camps/${c.id}`}>View</Link></div>)}</div></section><section className="unified-workspace__panel"><h2>Your workspace</h2><div className="unified-workspace__actions"><Link to="/profile">Volunteer profile</Link><Link to="/analytics">Community impact</Link>{organizations.length>0&&<Link to="/organization">Organization dashboard</Link>}</div></section></div>
  </div></section>;
}
