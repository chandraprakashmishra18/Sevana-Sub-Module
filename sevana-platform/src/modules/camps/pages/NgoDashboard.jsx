import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import RequireOrganizer from "../components/ngo/RequireOrganizer";
import {
  listOrgCamps, summarize, changeCampStatus, allowedActions, ACTION_LABEL, STATUS_LABEL,
} from "../services/ngoService";
import "./NgoDashboard.css";

const QUICK_ACTIONS = ["publish", "cancel"];

function Dashboard({ user }) {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("all");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let alive = true;
    listOrgCamps(user)
      .then((data) => { if (alive) setCamps(data); })
      .catch(() => { if (alive) setError("Could not load your camps."); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [user, reloadKey]);

  const runAction = async (camp, action) => {
    if (action === "cancel" && !window.confirm(`Cancel "${camp.title}"? It will be hidden from the public list and registrations will stop.`)) return;
    const result = await changeCampStatus(user, camp.id, action);
    if (result.ok) {
      setError("");
      setNotice(`"${camp.title}" is now ${STATUS_LABEL[result.status].toLowerCase()}.`);
      setReloadKey((k) => k + 1);
    } else {
      setError(result.error);
    }
  };

  const summary = summarize(camps);
  const visible = camps.filter((c) => filter === "all" || c.status === filter);
  const tiles = [
    ["Total camps", summary.total],
    ["Drafts", summary.drafts],
    ["Published", summary.published],
    ["Completed", summary.completed],
    ["Registered", summary.registrations],
    ["Volunteers", summary.volunteers],
    ["Beneficiaries", summary.beneficiaries],
    ["Attended", summary.present],
  ];

  return (
    <section className="ngo-page">
      <div className="container">
        <header className="ngo-top">
          <div>
            <span className="ngo-eyebrow">ORGANIZER DASHBOARD</span>
            <h1>{user.organization || user.name}</h1>
            <p className="ngo-muted">Create camps, manage registrations, mark attendance and record outcomes.</p>
          </div>
          <Link className="ngo-btn ngo-btn--primary" to="/organize">+ Create a camp</Link>
        </header>

        <div className="ngo-note">Demo mode: data is saved in this browser only. Authorization is not enforced by a server yet.</div>
        {notice && <div className="ngo-success" role="status">{notice}</div>}
        {error && <div className="ngo-alert" role="alert">{error}</div>}

        <div className="ngo-stats">
          {tiles.map(([label, value]) => (
            <div className="ngo-stat" key={label}><strong>{value}</strong><span>{label}</span></div>
          ))}
        </div>

        <section className="ngo-card">
          <div className="ngo-row">
            <h2>Your camps</h2>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status">
              <option value="all">All statuses</option>
              {Object.entries(STATUS_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>

          {loading ? <p className="ngo-muted">Loading camps...</p> : visible.length === 0 ? (
            <p className="ngo-muted">No camps here yet. Use "Create a camp" to add one.</p>
          ) : visible.map((c) => (
            <article className="ngo-camp" key={c.id}>
              <div>
                <strong>{c.title}</strong>
                <div className="ngo-meta">
                  <span className={`ngo-badge ngo-badge--${String(c.type).toLowerCase()}`}>{c.type}</span>
                  <span className={`ngo-badge ngo-status--${c.status}`}>{STATUS_LABEL[c.status] || c.status}</span>
                  <span>{c.date}</span>
                  <span>{c.location}</span>
                </div>
                <div className="ngo-meta">
                  <span>Volunteers {c.stats.volunteers}/{c.workerSlots?.total ?? "-"}</span>
                  <span>Beneficiaries {c.stats.beneficiaries}/{c.attendeeSlots?.total ?? "-"}</span>
                  {c.stats.waitlisted > 0 && <span>{c.stats.waitlisted} waitlisted</span>}
                </div>
              </div>
              <div className="ngo-actions">
                <Link className="ngo-btn" to={`/ngo/camps/${c.id}`}>Manage</Link>
                {allowedActions(c.status).filter((a) => QUICK_ACTIONS.includes(a)).map((a) => (
                  <button key={a} className={`ngo-btn ${a === "cancel" ? "ngo-btn--danger" : "ngo-btn--primary"}`} onClick={() => runAction(c, a)}>
                    {ACTION_LABEL[a]}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </section>
  );
}

function NgoDashboardPage() {
  const { user } = useAuth();
  return <RequireOrganizer><Dashboard user={user} /></RequireOrganizer>;
}

export default NgoDashboardPage;
