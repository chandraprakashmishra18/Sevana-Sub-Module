import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../shared/useAuth";
import { cancelCamp, getAllCamps, publishCamp } from "../services/campService";
import { getCampRegistrationsForCamp, markCampAttendance } from "../services/joinService";
import "./Dashboard.css";
import "./Workflow.css";

export default function CampManager() {
  const { activeOrganization } = useAuth();
  const [camps, setCamps] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const refresh = useCallback(async () => {
    if (!activeOrganization?.id) return;
    setLoading(true); setError("");
    try {
      const ownCamps = await getAllCamps({ organizationId: activeOrganization.id });
      setCamps(ownCamps);
      const lists = await Promise.all(ownCamps.filter(c=>c.apiStatus === "PUBLISHED").map(async camp => {
        try { return (await getCampRegistrationsForCamp(camp.id)).map(r=>({...r,campId:camp.id,campTitle:camp.title})); }
        catch { return []; }
      }));
      setRegistrations(lists.flat());
    } catch (err) { setError(err.message || "Could not load organization camps."); }
    finally { setLoading(false); }
  }, [activeOrganization?.id]);
  useEffect(() => { refresh(); }, [refresh]);

  const runAction = async (action, successMessage) => {
    setError(""); setMessage("");
    try { await action(); setMessage(successMessage); await refresh(); }
    catch (err) { setError(err.message || "The camp update failed."); }
  };

  return <section className="workspace-dashboard"><div className="container">
    <div className="workspace-dashboard__top"><div><span className="workspace-dashboard__eyebrow">ORGANIZATION CAMPS</span><h1>Camp management</h1><p>{activeOrganization?.name} · {activeOrganization?.verificationStatus}</p></div><Link className="workspace-dashboard__link" to="/organization">← Organization dashboard</Link></div>
    {message && <p role="status">{message}</p>}{error && <p role="alert">{error}</p>}
    <section className="workspace-dashboard__panel"><h2>Registrations ({registrations.length})</h2>{loading ? <p>Loading camp registrations…</p> : registrations.length ? registrations.map(r=><article className="manager-row" key={r.id}><div><strong>{r.fullName}</strong><small>{r.campTitle} · {r.role} · {r.email || r.phone}</small><small>Status: {r.status}{r.attendance ? ` · Attendance: ${r.attendance}` : ""}</small></div><div className="manager-row__actions">{r.status === "REGISTERED" && <><button type="button" onClick={()=>runAction(()=>markCampAttendance(r.campId,r.id,"PRESENT"),"Attendance marked present.")}>Present</button><button type="button" onClick={()=>runAction(()=>markCampAttendance(r.campId,r.id,"ABSENT"),"Attendance marked absent.")}>Absent</button></>}</div></article>) : <p>No registrations found for published camps.</p>}</section>
    <section className="workspace-dashboard__panel" style={{marginTop:18}}><h2>Your camps ({camps.length})</h2>{loading ? <p>Loading camps…</p> : camps.length ? camps.map(c=><article className="manager-row" key={c.id}><div><strong>{c.title}</strong><small>{c.date} · {c.location} · {c.apiStatus}</small></div><div className="manager-row__actions">{c.apiStatus === "DRAFT" && <button type="button" onClick={()=>runAction(()=>publishCamp(c.id),"Camp published.")}>Publish</button>}{["DRAFT","PUBLISHED"].includes(c.apiStatus) && <button type="button" onClick={()=>runAction(()=>cancelCamp(c.id),"Camp cancelled.")}>Cancel</button>}</div></article>) : <p>No camps created for this organization yet. <Link to="/organize">Create a camp</Link></p>}</section>
  </div></section>;
}
