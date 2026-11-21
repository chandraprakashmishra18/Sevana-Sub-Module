import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SafeImage from "../../../shared/SafeImage";
import { useAuth } from "../context/useAuth";
import XPBar from "../components/profile/XPBar";
import TierBadge from "../components/profile/TierBadge";
import BadgeGrid from "../components/profile/BadgeGrid";
import CampHistoryList from "../components/profile/CampHistoryList";
import { getWorkerById, getMyCampRegistrations, cancelMyCampRegistration } from "../services/joinService";
import { getAllCamps } from "../services/campService";
import Button from "../components/common/Button";
import { updateMyProfile } from "../../donations/services/userService";
import "./WorkerProfile.css";

function WorkerProfile() {
  const { id } = useParams();
  const { user: authUser } = useAuth();
  const [worker, setWorker] = useState(null);
  const [allCamps, setAllCamps] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(Boolean(id || authUser));
  const [profileError, setProfileError] = useState("");
  const [profileNotice, setProfileNotice] = useState("");
  const [saving, setSaving] = useState(false);

  // If no ID passed, check the currently authenticated user
  const effectiveId = id || (authUser ? authUser.id : null);

  useEffect(() => {
    let isMounted = true;

    if (!effectiveId) {
      return;
    }

    const ownProfile = !id || id === authUser?.id;
    Promise.all([getWorkerById(ownProfile ? null : effectiveId), getAllCamps(), ownProfile ? getMyCampRegistrations() : Promise.resolve([])]).then(([workerData, campsData, registrationData]) => {
      if (isMounted) {
        setWorker(workerData);
        setAllCamps(campsData);
        setRegistrations(registrationData);
        setLoading(false);
      }
    }).catch((error) => { if (isMounted) { setProfileError(error.message || "Unable to load profile."); setLoading(false); } });

    return () => {
      isMounted = false;
    };
  }, [effectiveId, id, authUser?.id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: "60px 0", textAlign: "center" }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  // Not logged in and no id specified
  if (!effectiveId) {
    return (
      <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
        <h2>Sign In to View Your Volunteer Profile</h2>
        <p style={{ color: "var(--color-text-muted)", margin: "12px 0 24px" }}>
          Log in or create a real user account to view your earned Community XP, badges, and camp history.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link to="/login"><Button variant="outline">Sign In</Button></Link>
          <Link to="/register"><Button variant="accent">Register Account</Button></Link>
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="container" style={{ padding: "60px 0", textAlign: "center" }}>
        <h2>{profileError ? "Profile unavailable" : "Volunteer profile not found"}</h2>
        {profileError && <p role="alert">{profileError}</p>}
        <Link to="/leaderboard">← Back to Leaderboard</Link>
      </div>
    );
  }

  const isOwnProfile = authUser && authUser.id === worker.id;
  const cancelRegistration = async (campId) => {
    try { await cancelMyCampRegistration(campId); setRegistrations((current) => current.map((item) => item.campId === campId ? { ...item, status: "cancelled" } : item)); }
    catch (error) { setProfileError(error.message || "Unable to cancel registration."); }
  };
  const saveProfile = async (event) => {
    event.preventDefault(); setSaving(true); setProfileError(""); setProfileNotice("");
    const form = new FormData(event.currentTarget);
    try { const updated = await updateMyProfile({ fullName: String(form.get("fullName") || "").trim(), phone: String(form.get("phone") || "").trim() || null }); setWorker((current) => ({ ...current, ...updated, name: updated.name || updated.fullName })); setProfileNotice("Profile saved."); }
    catch (error) { setProfileError(error.message || "Unable to save profile."); }
    finally { setSaving(false); }
  };

  return (
    <section className="worker-profile-page">
      <div className="container">
        <div className="worker-profile__header">
            {worker.avatar ? <SafeImage src={worker.avatar} alt="" className="worker-profile__avatar" /> : <span className="worker-profile__avatar" aria-hidden="true">{worker.name?.charAt(0) || "?"}</span>}
          <div className="worker-profile__identity">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h1>{worker.name}</h1>
              {isOwnProfile && <span style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", fontSize: "11.5px", fontWeight: "700", padding: "2px 8px", borderRadius: "999px" }}>You (Logged In)</span>}
            </div>
            <p className="worker-profile__role">{worker.role}</p>
            <TierBadge totalXP={worker.totalXP} size="lg" />
          </div>
        </div>

        <div className="worker-profile__xp-section">
          <XPBar totalXP={worker.totalXP} />
        </div>

        {isOwnProfile && <form className="worker-profile__card" onSubmit={saveProfile}><h2>Edit profile</h2><label>Name<input name="fullName" required minLength="2" maxLength="120" defaultValue={worker.fullName || worker.name} /></label><label>Phone<input name="phone" maxLength="20" defaultValue={worker.phone || ""} /></label>{profileError && <p role="alert">{profileError}</p>}{profileNotice && <p role="status">{profileNotice}</p>}<Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save profile"}</Button></form>}

        <div className="worker-profile__grid">
          <div className="worker-profile__card">
            <BadgeGrid badges={worker.badges} />
          </div>
          <div className="worker-profile__card">
            <CampHistoryList campsWorked={worker.campsWorked} allCamps={allCamps} />
          </div>
        </div>
        {isOwnProfile && <section className="worker-profile__card"><h2>My camp registrations</h2>{registrations.length ? registrations.map((item) => <article className="manager-row" key={item.id}><div><strong>{item.campTitle}</strong><small>{item.role} · {item.status}</small></div>{item.status !== "cancelled" && item.camp?.status === "PUBLISHED" && <Button variant="outline" onClick={() => cancelRegistration(item.campId)}>Cancel registration</Button>}</article>) : <p>No camp registrations yet.</p>}</section>}
      </div>
    </section>
  );
}

export default WorkerProfile;
