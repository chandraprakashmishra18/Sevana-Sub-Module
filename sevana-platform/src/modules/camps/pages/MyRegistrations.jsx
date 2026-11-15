import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getAllCamps } from "../services/campService";
import { getMyRegistrations, cancelMyRegistration } from "../services/joinService";
import "./NgoDashboard.css";

const ROLE_LABEL = { VOLUNTEER: "Volunteer", BENEFICIARY: "Beneficiary" };

function List({ user }) {
  const [campMap, setCampMap] = useState({});
  const [version, setVersion] = useState(0);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const registrations = getMyRegistrations(user); // re-read on every render; setVersion triggers a re-render

  useEffect(() => {
    let alive = true;
    getAllCamps().then((camps) => { if (alive) setCampMap(Object.fromEntries(camps.map((c) => [c.id, c]))); });
    return () => { alive = false; };
  }, [version]);

  const cancel = async (reg) => {
    if (!window.confirm(`Cancel your registration for "${reg.campTitle || "this camp"}"?`)) return;
    const result = await cancelMyRegistration(user, reg.id);
    if (result.success) { setError(""); setNotice("Registration cancelled."); setVersion((v) => v + 1); }
    else { setNotice(""); setError(result.error); }
  };

  return (
    <section className="ngo-page">
      <div className="container">
        <header className="ngo-top">
          <div>
            <span className="ngo-eyebrow">YOUR ACTIVITY</span>
            <h1>My registrations</h1>
            <p className="ngo-muted">Camps you registered for as a volunteer or beneficiary.</p>
          </div>
          <Link className="ngo-btn ngo-btn--primary" to="/camps">Find camps</Link>
        </header>

        {notice && <div className="ngo-success" role="status">{notice}</div>}
        {error && <div className="ngo-alert" role="alert">{error}</div>}

        <section className="ngo-card">
          {registrations.length === 0 ? (
            <p className="ngo-muted">You haven't registered for any camp with {user.email} yet.</p>
          ) : registrations.map((r) => {
            const camp = campMap[r.campId];
            const over = camp && (camp.status === "past" || camp.status === "cancelled");
            return (
              <article className="ngo-camp" key={r.id}>
                <div>
                  <strong><Link to={`/camps/${r.campId}`}>{r.campTitle || camp?.title || "Camp"}</Link></strong>
                  <div className="ngo-meta">
                    <span className="ngo-badge">{ROLE_LABEL[r.role]}</span>
                    <span className={`ngo-badge ngo-reg--${r.status}`}>{r.status.charAt(0) + r.status.slice(1).toLowerCase()}</span>
                    {camp && <span>{camp.date}</span>}
                    {camp && <span>{camp.location}</span>}
                    {camp?.status === "cancelled" && <span className="ngo-badge ngo-status--cancelled">Camp cancelled</span>}
                    {r.attendance && <span>Attendance: {r.attendance.toLowerCase()}</span>}
                  </div>
                </div>
                <div className="ngo-actions">
                  {r.status !== "CANCELLED" && !over && (
                    <button className="ngo-btn ngo-btn--danger" onClick={() => cancel(r)}>Cancel registration</button>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </section>
  );
}

function MyRegistrations() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return (
      <section className="ngo-page">
        <div className="container ngo-gate">
          <h1>Please log in</h1>
          <p>Log in to see the camps you registered for.</p>
          <Link className="ngo-btn ngo-btn--primary" to="/login">Log in</Link>
        </div>
      </section>
    );
  }
  return <List user={user} />;
}

export default MyRegistrations;
