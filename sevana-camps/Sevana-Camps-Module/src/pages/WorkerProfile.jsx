import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import XPBar from "../components/profile/XPBar";
import TierBadge from "../components/profile/TierBadge";
import BadgeGrid from "../components/profile/BadgeGrid";
import CampHistoryList from "../components/profile/CampHistoryList";
import { getWorkerById } from "../services/joinService";
import { getAllCamps } from "../services/campService";
import "./WorkerProfile.css";

function WorkerProfile() {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [allCamps, setAllCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getWorkerById(id), getAllCamps()]).then(([workerData, campsData]) => {
      if (isMounted) {
        setWorker(workerData);
        setAllCamps(campsData);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: "60px 0", textAlign: "center" }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="container" style={{ padding: "60px 0", textAlign: "center" }}>
        <h2>Worker profile not found</h2>
        <Link to="/leaderboard">← Back to Leaderboard</Link>
      </div>
    );
  }

  return (
    <section className="worker-profile-page">
      <div className="container">
        <div className="worker-profile__header">
          <img src={worker.avatar} alt={worker.name} className="worker-profile__avatar" />
          <div className="worker-profile__identity">
            <h1>{worker.name}</h1>
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