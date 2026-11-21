import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CAMPAIGN_CATEGORIES,
  CAMPAIGN_BENEFICIARIES,
} from "../utils/constants";
import "./Dashboard.css";
import "./Workflow.css";

import { getOrganizationCampaigns, saveCampaign } from "../services/campaignService";

const blank = {
  title: "",
  category: "Family Aid",
  targetBeneficiary: "General",
  ngo: "",
  location: "",
  description: "",
  goalAmount: "",
  deadline: "",
  status: "draft",
};
export default function CampaignManager() {
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const refresh = () => getOrganizationCampaigns().then(setCampaigns).catch((error) => setMessage(error.message));
  useEffect(() => {
    refresh();
  }, []);
  const edit = (campaign) => {
    setEditing(campaign.id);
    setForm({
      ...blank,
      ...campaign,
      goalAmount: campaign.goalAmount || "",
      status: campaign.status || "draft",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try { const saved = await saveCampaign({ ...form, ...(editing ? { id: editing } : {}), goalAmount: Number(form.goalAmount) });
    setForm(blank);
    setEditing("");
    setMessage(
      saved.status === "active" ? "Campaign published. No funds were collected." : "Campaign saved to the backend as a draft. No funds were collected.",
    );
    await refresh();
    } catch (error) { setMessage(error.message || "Unable to save campaign."); }
    finally { setSaving(false); }
  };
  return (
    <section className="workspace-dashboard">
      <div className="container">
        <div className="workspace-dashboard__top">
          <div>
            <span className="workspace-dashboard__eyebrow">
              ORGANIZATION TOOLS
            </span>
            <h1>Campaign management</h1>
            <p>
              Create or update a campaign record. Publishing requires a verified organization.
            </p>
          </div>
          <Link className="workspace-dashboard__link" to="/dashboard">
            ← Dashboard
          </Link>
        </div>
        <div className="workspace-dashboard__notice">
          Campaigns are stored by the backend. Platform moderation controls are not available; publishing is restricted to verified organizations. Payment processing is not enabled.
        </div>
        {message && <p role="status">{message}</p>}
        <form className="workspace-dashboard__panel" onSubmit={submit}>
          <h2>{editing ? "Edit campaign" : "Create campaign"}</h2>
          <div className="campaign-manager__form">
            <label>
              Campaign title
              <input
                required
                maxLength="100"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>
            <label>
              Category
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CAMPAIGN_CATEGORIES.filter((x) => x !== "All").map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Beneficiary
              <select
                value={form.targetBeneficiary || "General"}
                onChange={(e) =>
                  setForm({ ...form, targetBeneficiary: e.target.value })
                }
              >
                {CAMPAIGN_BENEFICIARIES.filter((x) => x !== "All").map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Organization
              <input value={form.ngo || "From your organization account"} readOnly />
            </label>
            <label>
              Location
              <input
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </label>
            <label>
              Financial target (₹)
              <input
                required
                min="1"
                type="number"
                value={form.goalAmount}
                onChange={(e) =>
                  setForm({ ...form, goalAmount: e.target.value })
                }
              />
            </label>
            <label>
              Deadline
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </label>
            <label>
              Campaign status (new campaigns start as drafts)
              <select value={form.status} disabled={!editing} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {["draft", "active", "paused", "completed", "cancelled"].map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}
              </select>
            </label>
            <label className="campaign-manager__wide">
              Description
              <textarea
                required
                minLength="20"
                rows="4"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </label>
          </div>
          <button className="workspace-dashboard__primary" type="submit" disabled={saving}>
            {saving ? "Saving…" : editing ? "Save changes" : "Save campaign"}
          </button>
          {editing && (
            <button
              className="workspace-dashboard__secondary"
              type="button"
              onClick={() => {
                setEditing("");
                setForm(blank);
              }}
            >
              Cancel edit
            </button>
          )}
        </form>
        <section
          className="workspace-dashboard__panel"
          style={{ marginTop: 18 }}
        >
          <h2>Campaigns ({campaigns.length})</h2>
          <div className="workspace-dashboard__list">
            {campaigns.map((c) => (
              <article key={c.id}>
                <div>
                  <strong>{c.title}</strong>
                  <small>
                    {c.ngo} · {c.status || "published"} · {c.location}
                  </small>
                </div>
                <button
                  className="workspace-dashboard__text-button"
                  onClick={() => edit(c)}
                >
                  Edit
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
