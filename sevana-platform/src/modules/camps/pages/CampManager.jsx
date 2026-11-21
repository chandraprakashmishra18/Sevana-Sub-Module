import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrganizationCamps, updateCamp } from "../services/campService";
import { getCampRegistrations, updateCampRegistration } from "../services/joinService";
import "./Dashboard.css";
import "./Workflow.css";

export default function CampManager() {
  const [camps, setCamps] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const refresh = async () => {
    setError(""); setLoading(true);
    try { const [nextCamps, nextRegistrations] = await Promise.all([getOrganizationCamps(), getCampRegistrations()]); setCamps(nextCamps); setRegistrations(nextRegistrations); }
    catch (requestError) { setError(requestError.message || "Unable to load organization camps."); }
    finally { setLoading(false); }
  };
  useEffect(() => {
    Promise.all([getOrganizationCamps(), getCampRegistrations()])
      .then(([nextCamps, nextRegistrations]) => { setCamps(nextCamps); setRegistrations(nextRegistrations); })
      .catch((requestError) => setError(requestError.message || "Unable to load organization camps."))
      .finally(() => setLoading(false));
  }, []);
  const changeRegistration = async (registration, updates) => {
    setNotice(""); setError("");
    try { await updateCampRegistration(registration, updates); setNotice("Registration updated."); await refresh(); }
    catch (requestError) { setError(requestError.message || "Unable to update registration."); }
  };
  const changeCampStatus = async (camp, status) => {
    setNotice(""); setError("");
    try { await updateCamp({ ...camp, status }); setNotice("Camp status updated."); await refresh(); }
    catch (requestError) { setError(requestError.message || "Unable to update camp."); }
  };
  return <section className="workspace-dashboard"><div className="container">
    <div className="workspace-dashboard__top"><div><span className="workspace-dashboard__eyebrow">ORGANIZER TOOLS</span><h1>Camp management</h1><p>Manage your organization's camps, registrations, and attendance.</p></div><Link className="workspace-dashboard__link" to="/dashboard">← Dashboard</Link></div>
    <div className="workspace-dashboard__notice">Changes are saved to the Sevana database.</div>
    {error && <p role="alert" className="workspace-dashboard__notice">{error}</p>}{notice && <p role="status" className="workspace-dashboard__notice">{notice}</p>}
    {loading ? <p>Loading organization camps…</p> : <>
      <section className="workspace-dashboard__panel"><h2>Registrations ({registrations.length})</h2>{registrations.length ? registrations.map((registration) => <article className="manager-row" key={registration.id}><div><strong>{registration.fullName || registration.name}</strong><small>{camps.find((camp) => camp.id === registration.campId)?.title || registration.campId} · {registration.role} · {registration.email}</small><small>Status: {registration.status}{registration.attended ? " · Present" : ""}</small></div><div className="manager-row__actions"><button onClick={() => changeRegistration(registration, { status: "approved" })}>Approve</button><button onClick={() => changeRegistration(registration, { status: "rejected" })}>Reject</button><button onClick={() => changeRegistration(registration, { attended: !registration.attended })}>Mark {registration.attended ? "absent" : "present"}</button></div></article>) : <p className="workspace-dashboard__muted">No registrations for your organization's camps.</p>}</section>
      <section className="workspace-dashboard__panel" style={{ marginTop: 18 }}><h2>Your camps ({camps.length})</h2>{camps.length ? camps.map((camp) => <article className="manager-row" key={camp.id}><div><strong>{camp.title}</strong><small>{camp.organizer} · {camp.date} · {camp.location} · {camp.publicationStatus}</small></div><div className="manager-row__actions">{camp.publicationStatus === "DRAFT" && <button onClick={() => changeCampStatus(camp, "upcoming")}>Publish</button>}{camp.publicationStatus === "PUBLISHED" && camp.startsAt <= new Date().toISOString() && <button onClick={() => changeCampStatus(camp, "past")}>Mark completed</button>}{["PUBLISHED", "DRAFT"].includes(camp.publicationStatus) && <button onClick={() => changeCampStatus(camp, "cancelled")}>Cancel</button>}</div></article>) : <p className="workspace-dashboard__muted">No camps found for your organizations.</p>}</section>
    </>}
  </div></section>;
}
