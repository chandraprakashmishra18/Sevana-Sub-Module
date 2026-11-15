import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import RequireOrganizer from "../components/ngo/RequireOrganizer";
import {
  getManagedCamp, changeCampStatus, editCamp, setRegistrationStatus, setAttendance, saveOutcome,
  allowedActions, ACTION_LABEL, STATUS_LABEL,
} from "../services/ngoService";
import "./NgoDashboard.css";

const REG_STATUSES = ["REGISTERED", "WAITLISTED", "CANCELLED"];
const ATTENDANCE = ["PRESENT", "ABSENT", "EXCUSED"];
const ROLE_LABEL = { VOLUNTEER: "Volunteer", BENEFICIARY: "Beneficiary" };

function EditForm({ camp, onSubmit, disabled }) {
  const [f, setF] = useState({
    title: camp.title || "",
    description: camp.description || "",
    date: camp.date || "",
    time: camp.time || "",
    location: camp.location || "",
    workerTotal: camp.workerSlots?.total ?? 0,
    attendeeTotal: camp.attendeeSlots?.total ?? 0,
  });
  const set = (key) => (e) => setF({ ...f, [key]: e.target.value });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(f); }}>
      <div className="ngo-grid">
        <label className="ngo-field"><span>Title</span><input value={f.title} onChange={set("title")} /></label>
        <label className="ngo-field"><span>Date</span><input type="date" value={f.date} onChange={set("date")} /></label>
        <label className="ngo-field"><span>Time</span><input value={f.time} onChange={set("time")} placeholder="9:00 AM - 2:00 PM" /></label>
        <label className="ngo-field"><span>Location</span><input value={f.location} onChange={set("location")} /></label>
        <label className="ngo-field"><span>Volunteer slots</span><input type="number" min="0" value={f.workerTotal} onChange={set("workerTotal")} /></label>
        <label className="ngo-field"><span>Beneficiary slots</span><input type="number" min="0" value={f.attendeeTotal} onChange={set("attendeeTotal")} /></label>
      </div>
      <label className="ngo-field"><span>Description</span><textarea rows={3} value={f.description} onChange={set("description")} /></label>
      <div className="ngo-actions"><button className="ngo-btn ngo-btn--primary" disabled={disabled}>Save changes</button></div>
    </form>
  );
}

function OutcomeForm({ camp, stats, existing, onSubmit }) {
  const [f, setF] = useState({
    summary: existing?.summary || "",
    beneficiariesServed: existing?.beneficiariesServed ?? stats.present,
    volunteersParticipated: existing?.volunteersParticipated ?? stats.volunteers,
    servicesProvided: existing?.servicesProvided || "",
    materialsDistributed: existing?.materialsDistributed || "",
  });
  const set = (key) => (e) => setF({ ...f, [key]: e.target.value });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(f); }}>
      <label className="ngo-field"><span>Summary *</span><textarea rows={3} value={f.summary} onChange={set("summary")} /></label>
      <div className="ngo-grid">
        <label className="ngo-field"><span>Beneficiaries served</span><input type="number" min="0" value={f.beneficiariesServed} onChange={set("beneficiariesServed")} /></label>
        <label className="ngo-field"><span>Volunteers participated</span><input type="number" min="0" value={f.volunteersParticipated} onChange={set("volunteersParticipated")} /></label>
      </div>
      <label className="ngo-field"><span>Services provided</span><textarea rows={2} value={f.servicesProvided} onChange={set("servicesProvided")} /></label>
      <label className="ngo-field"><span>Materials distributed</span><textarea rows={2} value={f.materialsDistributed} onChange={set("materialsDistributed")} /></label>
      <div className="ngo-actions"><button className="ngo-btn ngo-btn--primary">{existing ? "Update outcome" : "Save outcome"}</button></div>
      <p className="ngo-muted">Saving also shows the summary on the public page of "{camp.title}".</p>
    </form>
  );
}

function Manage({ user, campId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let alive = true;
    getManagedCamp(user, campId).then((result) => { if (alive) setData(result); });
    return () => { alive = false; };
  }, [user, campId, reloadKey]);

  const run = async (promise, successMessage) => {
    const result = await promise;
    if (result.ok) {
      setError("");
      if (successMessage) setNotice(successMessage);
      setReloadKey((k) => k + 1);
    } else {
      setNotice("");
      setError(result.error);
    }
  };

  if (!data) return <section className="ngo-page"><div className="container"><p className="ngo-muted">Loading...</p></div></section>;
  if (!data.ok) {
    return (
      <section className="ngo-page"><div className="container ngo-gate">
        <h1>Can't open this camp</h1><p>{data.error}</p>
        <Link className="ngo-btn" to="/ngo">← Back to dashboard</Link>
      </div></section>
    );
  }

  const { camp, registrations, stats, outcome } = data;
  const shown = registrations.filter((r) => roleFilter === "ALL" || r.role === roleFilter);
  const canEdit = camp.status !== "past" && camp.status !== "cancelled";

  return (
    <section className="ngo-page">
      <div className="container">
        <Link className="ngo-link" to="/ngo">← Back to dashboard</Link>
        <header className="ngo-top">
          <div>
            <span className="ngo-eyebrow">MANAGE CAMP</span>
            <h1>{camp.title}</h1>
            <div className="ngo-meta">
              <span className={`ngo-badge ngo-badge--${String(camp.type).toLowerCase()}`}>{camp.type}</span>
              <span className={`ngo-badge ngo-status--${camp.status}`}>{STATUS_LABEL[camp.status] || camp.status}</span>
              <span>{camp.date}</span><span>{camp.location}</span>
            </div>
          </div>
          <div className="ngo-actions">
            {allowedActions(camp.status).map((a) => (
              <button
                key={a}
                className={`ngo-btn ${a === "cancel" ? "ngo-btn--danger" : a === "publish" || a === "complete" ? "ngo-btn--primary" : ""}`}
                onClick={() => {
                  if (a === "cancel" && !window.confirm(`Cancel "${camp.title}"?`)) return;
                  run(changeCampStatus(user, camp.id, a), `Camp updated: ${ACTION_LABEL[a].toLowerCase()}.`);
                }}
              >{ACTION_LABEL[a]}</button>
            ))}
          </div>
        </header>

        {notice && <div className="ngo-success" role="status">{notice}</div>}
        {error && <div className="ngo-alert" role="alert">{error}</div>}

        <div className="ngo-stats">
          <div className="ngo-stat"><strong>{stats.volunteers}/{camp.workerSlots?.total ?? "-"}</strong><span>Volunteers</span></div>
          <div className="ngo-stat"><strong>{stats.beneficiaries}/{camp.attendeeSlots?.total ?? "-"}</strong><span>Beneficiaries</span></div>
          <div className="ngo-stat"><strong>{stats.waitlisted}</strong><span>Waitlisted</span></div>
          <div className="ngo-stat"><strong>{stats.present}</strong><span>Marked present</span></div>
        </div>

        {canEdit && (
          <details className="ngo-card">
            <summary><strong>Edit camp details</strong></summary>
            <EditForm
              key={`${camp.id}-${reloadKey}`}
              camp={camp}
              onSubmit={(fields) => run(editCamp(user, camp.id, fields), "Camp details saved.")}
            />
          </details>
        )}

        <section className="ngo-card">
          <div className="ngo-row">
            <h2>Registrations ({registrations.length})</h2>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} aria-label="Filter by role">
              <option value="ALL">Everyone</option>
              <option value="BENEFICIARY">Beneficiaries</option>
              <option value="VOLUNTEER">Volunteers</option>
            </select>
          </div>
          {shown.length === 0 ? <p className="ngo-muted">No registrations yet. They appear here when people join this camp from the public page.</p> : (
            <div className="ngo-table-wrap">
              <table className="ngo-table">
                <thead><tr><th>Name</th><th>Contact</th><th>Role</th><th>Status</th><th>Attendance</th></tr></thead>
                <tbody>
                  {shown.map((r) => (
                    <tr key={r.id}>
                      <td>{r.fullName}<br /><small className="ngo-muted">{r.skillOrProfession || r.ageGroup || ""}</small></td>
                      <td>{r.email || "-"}<br /><small>{r.phone || ""}</small></td>
                      <td>{ROLE_LABEL[r.role]}</td>
                      <td>
                        <select value={r.status} onChange={(e) => run(setRegistrationStatus(user, r.id, e.target.value))}>
                          {REG_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
                        </select>
                      </td>
                      <td>
                        <div className="ngo-chips">
                          {ATTENDANCE.map((a) => (
                            <button
                              key={a}
                              className={`ngo-chip ${r.attendance === a ? "is-on" : ""}`}
                              disabled={r.status !== "REGISTERED"}
                              onClick={() => run(setAttendance(user, r.id, r.attendance === a ? null : a))}
                            >{a.charAt(0) + a.slice(1).toLowerCase()}</button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="ngo-card">
          <h2>Camp outcome</h2>
          {camp.status === "past" ? (
            <OutcomeForm
              key={`${camp.id}-${outcome?.reportedAt || "new"}`}
              camp={camp}
              stats={stats}
              existing={outcome}
              onSubmit={(fields) => run(saveOutcome(user, camp.id, fields), "Outcome saved.")}
            />
          ) : (
            <p className="ngo-muted">Mark the camp as completed to record its outcome (people served, volunteers, services, materials).</p>
          )}
        </section>
      </div>
    </section>
  );
}

function NgoCampManagePage() {
  const { id } = useParams();
  const { user } = useAuth();
  return <RequireOrganizer><Manage user={user} campId={id} /></RequireOrganizer>;
}

export default NgoCampManagePage;
