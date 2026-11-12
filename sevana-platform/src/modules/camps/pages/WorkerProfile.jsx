import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import XPBar from "../components/profile/XPBar";
import TierBadge from "../components/profile/TierBadge";
import BadgeGrid from "../components/profile/BadgeGrid";
import CampHistoryList from "../components/profile/CampHistoryList";
import { getWorkerById } from "../services/joinService";
import { getAllCamps } from "../services/campService";
import Button from "../components/common/Button";
import "./WorkerProfile.css";

function WorkerProfile() {
  const { id } = useParams();
  const { user: authUser } = useAuth();
  const [worker, setWorker] = useState(null);
  const [allCamps, setAllCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  // If no ID passed, check the currently authenticated user
  const effectiveId = id || (authUser ? authUser.id : null);

  useEffect(() => {
    let isMounted = true;

    if (!effectiveId) {
      setLoading(false);
      return;
    }

    Promise.all([getWorkerById(effectiveId), getAllCamps()]).then(([workerData, campsData]) => {
      if (isMounted) {
        setWorker(workerData);
        setAllCamps(campsData);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [effectiveId, authUser]);

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
          <Link to="/register"><Button variant="accent">Register Account (+50 XP)</Button></Link>
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="container" style={{ padding: "60px 0", textAlign: "center" }}>
        <h2>Volunteer profile not found</h2>
        <Link to="/leaderboard">← Back to Leaderboard</Link>
      </div>
    );
  }

  const isOwnProfile = authUser && authUser.id === worker.id;

  return (
    <section className="worker-profile-page">
      <div className="container">
        <div className="worker-profile__header">
          <img src={worker.avatar} alt={worker.name} className="worker-profile__avatar" />
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

        <div className="worker-profile__grid">
          <div className="worker-profile__card">
            <BadgeGrid badges={worker.badges} />
          </div>
          <div className="worker-profile__card">
            <CampHistoryList campsWorked={worker.campsWorked} allCamps={allCamps} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default WorkerProfile;
