import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "./apiClient";
import { useAuth } from "./useAuth";

const sections = ["Overview", "Organizations", "Campaigns", "Contact inbox", "Audit log", "Roles"];
const statusLabel = (value) => String(value || "").replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
const dateLabel = (value) => value ? new Date(value).toLocaleString() : "—";

function ErrorState({ error, retry }) {
  return <div className="unified-workspace__notice" role="alert">{error?.status === 401 ? "Your session has expired. Sign in again." : error?.status === 403 ? "Your account does not have platform administrator access." : error?.message || "Unable to load administrator data."}{retry && <button className="unified-workspace__secondary" onClick={retry}>Retry</button>}</div>;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [section, setSection] = useState("Overview");
  const [summary, setSummary] = useState(null);
  const [rows, setRows] = useState([]);
  const [audit, setAudit] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState("");
  const [action, setAction] = useState(null);
  const [reason, setReason] = useState("");

  const load = useCallback(async (target = section) => {
    setBusy(true); setError(null);
    try {
      if (target === "Overview") {
        const [s, a] = await Promise.all([apiRequest("/admin/summary"), apiRequest("/admin/audit-logs?limit=8")]);
        setSummary(s.data); setAudit(a.data);
      } else if (target === "Organizations") setRows((await apiRequest("/admin/organizations?limit=100")).data);
      else if (target === "Campaigns") setRows((await apiRequest("/admin/campaigns?limit=100")).data);
      else if (target === "Contact inbox") setRows((await apiRequest("/admin/contact-messages?limit=100")).data);
      else if (target === "Audit log") setAudit((await apiRequest("/admin/audit-logs?limit=100")).data);
      else if (target === "Roles") setUsers((await apiRequest(`/admin/users?limit=100${search ? `&search=${encodeURIComponent(search)}` : ""}`)).data);
    } catch (e) { setError(e); }
    finally { setBusy(false); }
  }, [section, search]);

  useEffect(() => { const timer = window.setTimeout(() => load(section), 0); return () => window.clearTimeout(timer); }, [section, load]);

  async function submitAction() {
    if (!action || reason.trim().length < (action.type === "contact" ? 3 : 5)) return;
    setBusy(true); setError(null);
    try {
      const { type, row, value } = action;
      const configs = {
        organization: [`/admin/organizations/${row.id}/verification`, { status: value, reason: reason.trim() }],
        campaign: [`/admin/campaigns/${row.id}/moderation`, { status: value, reason: reason.trim() }],
        contact: [`/admin/contact-messages/${row.id}`, { status: value, reason: reason.trim() }],
        role: [`/admin/users/${row.id}/platform-role`, { platformRole: value, reason: reason.trim() }],
      };
      const [path, body] = configs[type];
      await apiRequest(path, { method: "PATCH", body });
      setNotice("Change saved and recorded in the audit log."); setAction(null); setReason(""); await load(section);
    } catch (e) { setError(e); setBusy(false); }
  }

  const begin = (type, row, value, label) => { setAction({ type, row, value, label }); setReason(""); setError(null); };
  const countCards = summary ? [
    ["Organizations", summary.organizations, "PENDING"], ["Campaigns", summary.campaigns, "DRAFT"], ["Contact messages", summary.contactMessages, "NEW"],
  ] : [];

  return <main className="unified-workspace"><div className="container">
    <header className="unified-workspace__header"><div><span className="unified-workspace__eyebrow">PLATFORM ADMINISTRATION</span><h1>Admin dashboard</h1><p>Review platform submissions and account access.</p></div></header>
    <nav className="admin-nav" aria-label="Admin sections">{sections.map((item) => <button key={item} className={section === item ? "admin-nav__active" : ""} onClick={() => { setSection(item); setNotice(""); setError(null); }}>{item}</button>)}</nav>
    {notice && <div className="unified-workspace__notice" role="status">{notice}</div>}
    {error && <ErrorState error={error} retry={() => load(section)} />}
    {busy && <p role="status">Loading {section.toLowerCase()}…</p>}
    {!busy && !error && section === "Overview" && <>
      <div className="unified-workspace__grid">{countCards.map(([label, data, pending]) => <article className="unified-workspace__card" key={label}><span>{label}</span><strong>{data.total}</strong><small>{data.byStatus[pending] || 0} {statusLabel(pending)} · {Object.entries(data.byStatus).map(([k,v]) => `${statusLabel(k)} ${v}`).join(" · ")}</small></article>)}</div>
      <section className="unified-workspace__panel admin-panel"><h2>Recent administrator actions</h2><AuditRows rows={audit} /></section>
    </>}
    {!busy && !error && section === "Organizations" && <section className="unified-workspace__panel admin-panel"><h2>Organizations</h2>{rows.length ? <div className="admin-list">{rows.map((row) => <article key={row.id} className="admin-item"><div><strong>{row.name}</strong><p>{row.type} · {row.city || "Location not provided"}{row.state ? `, ${row.state}` : ""}</p><small>Status: {statusLabel(row.verificationStatus)} · Submitted {dateLabel(row.createdAt)}</small></div><div className="admin-actions">{row.verificationStatus !== "VERIFIED" && <button className="unified-workspace__primary" onClick={() => begin("organization", row, "VERIFIED", "Approve verification")}>Approve</button>}{row.verificationStatus !== "REJECTED" && <button className="unified-workspace__secondary" onClick={() => begin("organization", row, "REJECTED", "Reject verification")}>Reject</button>}</div></article>)}</div> : <p>No organizations to review.</p>}</section>}
    {!busy && !error && section === "Campaigns" && <section className="unified-workspace__panel admin-panel"><h2>Campaign moderation</h2>{rows.length ? <div className="admin-list">{rows.map((row) => <article key={row.id} className="admin-item admin-item--stack"><div><strong>{row.title}</strong><p>{row.organization?.name || "Organization"} · {row.category} · Status: {statusLabel(row.status)}</p><p>{row.description || "No description provided."}</p><small>Goal: {row.currency} {Number(row.goalAmount || 0).toLocaleString()} · {row.location || "Location not provided"} · {dateLabel(row.startDate)} – {dateLabel(row.endDate)}</small></div><div className="admin-actions">{row.status !== "ACTIVE" && <button className="unified-workspace__primary" onClick={() => begin("campaign", row, "ACTIVE", "Approve and activate campaign")}>Approve / activate</button>}{row.status !== "PAUSED" && row.status !== "CANCELLED" && <button className="unified-workspace__secondary" onClick={() => begin("campaign", row, "PAUSED", "Pause campaign")}>Pause</button>}{row.status !== "CANCELLED" && <button className="unified-workspace__secondary" onClick={() => begin("campaign", row, "CANCELLED", "Reject / cancel campaign")}>Reject / cancel</button>}</div></article>)}</div> : <p>No campaigns to review.</p>}</section>}
    {!busy && !error && section === "Contact inbox" && <section className="unified-workspace__panel admin-panel"><h2>Contact messages</h2>{rows.length ? <div className="admin-list">{rows.map((row) => <details key={row.id} className="admin-item admin-contact"><summary><strong>{row.subject}</strong><span>{statusLabel(row.status)} · {dateLabel(row.createdAt)}</span></summary><p>{row.message}</p><small>{row.name} · {row.email}</small><div className="admin-actions">{row.status !== "REVIEWED" && <button className="unified-workspace__primary" onClick={() => begin("contact", row, "REVIEWED", "Mark message reviewed")}>Mark reviewed</button>}{row.status !== "CLOSED" && <button className="unified-workspace__secondary" onClick={() => begin("contact", row, "CLOSED", "Close message")}>Close</button>}</div></details>)}</div> : <p>No messages in the inbox.</p>}</section>}
    {!busy && !error && section === "Audit log" && <section className="unified-workspace__panel admin-panel"><h2>Audit log</h2><AuditRows rows={audit} /></section>}
    {!busy && !error && section === "Roles" && <section className="unified-workspace__panel admin-panel"><h2>Platform roles</h2><form className="admin-search" onSubmit={(event) => { event.preventDefault(); load("Roles"); }}><label htmlFor="admin-user-search">Find an account by name or email</label><input id="admin-user-search" value={search} maxLength={100} onChange={(event) => setSearch(event.target.value)} /><button className="unified-workspace__secondary">Search</button></form>{users.length ? <div className="admin-list">{users.map((row) => <article key={row.id} className="admin-item"><div><strong>{row.fullName}</strong><p>{row.email}</p><small>{row.platformRole} · {row.isActive ? "Active" : "Inactive"} · Joined {dateLabel(row.createdAt)}</small></div>{row.isActive && <button disabled={row.platformRole === "ADMIN" && row.id === user?.id} className="unified-workspace__secondary" onClick={() => begin("role", row, row.platformRole === "ADMIN" ? "INDIVIDUAL" : "ADMIN", row.platformRole === "ADMIN" ? "Revoke administrator access" : "Grant administrator access")}>{row.platformRole === "ADMIN" ? "Revoke ADMIN" : "Grant ADMIN"}</button>}</article>)}</div> : <p>No matching accounts.</p>}</section>}
    {action && <div className="admin-modal-backdrop" role="presentation"><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-confirm-title"><h2 id="admin-confirm-title">Confirm: {action.label}</h2><p>{action.type === "role" ? `This will change ${action.row.fullName}'s platform role to ${action.value}. The action will be audited.` : `This will update ${action.row.name || action.row.title || action.row.subject} and record the action in the audit log.`}</p><label htmlFor="admin-action-reason">Reason (required)</label><textarea id="admin-action-reason" rows="3" maxLength="1000" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Enter the reason for this change" /><div className="admin-actions"><button className="unified-workspace__secondary" onClick={() => setAction(null)}>Cancel</button><button className="unified-workspace__primary" disabled={reason.trim().length < (action.type === "contact" ? 3 : 5) || busy} onClick={submitAction}>Confirm change</button></div></section></div>}
  </div><style>{`.admin-nav{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 18px}.admin-nav button{border:1px solid #cbd5e1;background:#fff;border-radius:999px;padding:9px 14px;cursor:pointer;font:inherit}.admin-nav .admin-nav__active{background:#0f766e;color:white;border-color:#0f766e}.admin-panel{margin-top:16px}.admin-list{display:grid}.admin-item{display:flex;justify-content:space-between;align-items:center;gap:18px;padding:16px 0;border-top:1px solid #e2e8f0}.admin-item p{margin:6px 0;color:#475569}.admin-item small{color:#64748b}.admin-item--stack{align-items:flex-start;flex-direction:column}.admin-item--stack>div:first-child{max-width:900px}.admin-actions{display:flex;flex-wrap:wrap;gap:8px}.admin-actions button:disabled{opacity:.55;cursor:not-allowed}.admin-contact summary{display:flex;justify-content:space-between;gap:12px;cursor:pointer}.admin-contact[open]{display:block}.admin-contact[open]>p{white-space:pre-wrap}.admin-contact .admin-actions{margin-top:12px}.admin-search{display:flex;align-items:end;gap:10px;flex-wrap:wrap;margin-bottom:14px}.admin-search label{display:grid;gap:6px}.admin-search input,.admin-modal textarea{padding:10px;border:1px solid #cbd5e1;border-radius:8px;font:inherit}.admin-modal-backdrop{position:fixed;inset:0;background:#0f172a99;display:grid;place-items:center;padding:18px;z-index:1000}.admin-modal{background:white;border-radius:16px;padding:24px;width:min(520px,100%);box-shadow:0 20px 70px #0f172a55}.admin-modal h2{margin-top:0}.admin-modal textarea{width:100%;box-sizing:border-box;margin:8px 0 14px}.admin-modal label{font-weight:600}.admin-modal .admin-actions{justify-content:flex-end}@media(max-width:600px){.admin-item{align-items:flex-start;flex-direction:column}.admin-contact summary{align-items:flex-start;flex-direction:column}}`}</style></main>;
}

function AuditRows({ rows }) {
  if (!rows?.length) return <p>No administrator actions recorded.</p>;
  return <div className="unified-workspace__rows">{rows.map((entry) => <article className="unified-workspace__row" key={entry.id}><div><strong>{statusLabel(entry.action)}</strong><small>{entry.actorLabel || "Administrator"}{entry.actorUserId ? ` · ${entry.actorUserId}` : ""} · {entry.entityType} · {entry.entityId}</small></div><time dateTime={entry.createdAt}>{dateLabel(entry.createdAt)}</time></article>)}</div>;
}
