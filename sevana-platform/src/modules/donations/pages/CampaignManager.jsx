import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../shared/useAuth";
import { createCampaign, getAllCampaigns, updateCampaign, updateCampaignStatus } from "../services/campaignService";
import "./Dashboard.css";
import "./Workflow.css";

const blank = { title: "", category: "Food Support", location: "", description: "", goalAmount: "", deadline: "" };
const categories = ["Student Sponsorship", "Medical Aid", "Food Support", "Clothing Support", "Emergency Relief", "Education", "Health", "Other"];

export default function CampaignManager() {
  const { activeOrganization } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    if (!activeOrganization?.id) return;
    setLoading(true);
    try { setCampaigns(await getAllCampaigns({ organizationId: activeOrganization.id })); setError(""); }
    catch (err) { setError(err.message || "Could not load campaigns."); }
    finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, [activeOrganization?.id]);

  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError(""); setMessage("");
    try {
      if (editing) await updateCampaign(editing.id, form);
      else await createCampaign({ ...form, organizationId: activeOrganization.id });
      setMessage("Campaign draft saved to Sevana."); setForm(blank); setEditing(null); await refresh();
    } catch (err) { setError(err.message || "Could not save campaign."); }
    finally { setSaving(false); }
  };

  const changeStatus = async (campaign, status) => {
    setError(""); setMessage("");
    try { await updateCampaignStatus(campaign.id, status); setMessage(`Campaign status updated to ${status.toLowerCase()}.`); await refresh(); }
    catch (err) { setError(err.message || "Could not update campaign status."); }
  };

  return <section className="workspace-dashboard"><div className="container">
    <div className="workspace-dashboard__top"><div><span className="workspace-dashboard__eyebrow">ORGANIZATION CAMPAIGNS</span><h1>Campaign management</h1><p>{activeOrganization?.name} · {activeOrganization?.verificationStatus || "Verification pending"}</p></div><Link className="workspace-dashboard__link" to="/organization">← Organization dashboard</Link></div>
    {message && <p role="status">{message}</p>}{error && <p role="alert">{error}</p>}
    <form className="workspace-dashboard__panel" onSubmit={submit}><h2>{editing ? "Edit campaign draft" : "Create campaign draft"}</h2><div className="campaign-manager__form">
      <label>Campaign title<input required minLength="3" maxLength="200" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label>
      <label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{categories.map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Location<input value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></label>
      <label>Fundraising goal (INR)<input min="1" type="number" value={form.goalAmount} onChange={e=>setForm({...form,goalAmount:e.target.value})}/></label>
      <label>End date<input type="date" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})}/></label>
      <label className="campaign-manager__wide">Description<textarea required minLength="10" rows="4" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label>
    </div><button className="workspace-dashboard__primary" type="submit" disabled={saving}>{saving ? "Saving…" : editing ? "Save changes" : "Save draft"}</button>{editing && <button className="workspace-dashboard__secondary" type="button" onClick={()=>{setEditing(null);setForm(blank)}}>Cancel edit</button>}</form>
    <section className="workspace-dashboard__panel" style={{marginTop:18}}><h2>Your campaigns ({campaigns.length})</h2>{activeOrganization?.verificationStatus !== "VERIFIED" && <p>Campaign activation is disabled until this organization is verified. Draft management remains available.</p>}{loading ? <p>Loading campaigns…</p> : campaigns.length ? <div className="workspace-dashboard__list">{campaigns.map(c=><article key={c.id}><div><strong>{c.title}</strong><small>{c.status} · {c.location || "Location not set"}</small></div><div className="manager-row__actions"><button type="button" onClick={()=>{setEditing(c);setForm({title:c.title,category:c.category,location:c.location||"",description:c.description,goalAmount:c.goalAmount||"",deadline:c.endDate?new Date(c.endDate).toISOString().slice(0,10):""});window.scrollTo({top:0,behavior:"smooth"})}} disabled={["completed","cancelled"].includes(c.status)}>Edit</button>{c.status === "draft" || c.status === "paused" ? <button type="button" disabled={activeOrganization?.verificationStatus !== "VERIFIED"} onClick={()=>changeStatus(c,"ACTIVE")}>Activate</button> : null}{c.status === "active" ? <button type="button" onClick={()=>changeStatus(c,"PAUSED")}>Pause</button> : null}{["draft","active","paused"].includes(c.status) ? <button type="button" onClick={()=>changeStatus(c,"CANCELLED")}>Cancel</button> : null}</div></article>)}</div> : <p>No campaigns for this organization yet.</p>}</section>
  </div></section>;
}
