import { useState, useEffect } from "react";
import Leaderboard from "../components/profile/Leaderboard";
import { getLeaderboardData } from "../services/joinService";
import "./LeaderboardPage.css";

function LeaderboardPage() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getLeaderboardData().then((data) => {
      if (isMounted) {
        setWorkers(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="leaderboard-page">
      <div className="container">
        <div className="leaderboard-page__header">
          <h1>Volunteer Leaderboard</h1>
          <p>Demo rankings combine sample profiles and camp activity saved in this browser. XP and participation are not independently verified.</p>
        </div>

        {loading ? (
          <p className="leaderboard-page__loading">Loading leaderboard...</p>
        ) : (
          <Leaderboard workers={workers} />
        )}
      </div>
    </section>
  );
}

export default LeaderboardPage;
