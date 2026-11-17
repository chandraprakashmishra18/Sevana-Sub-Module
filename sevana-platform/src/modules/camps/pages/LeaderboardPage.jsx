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
          <p>A volunteer leaderboard is not available because camp contribution points are not stored by the backend.</p>
        </div>

        {loading ? (
          <p className="leaderboard-page__loading">Loading leaderboard...</p>
        ) : (
          workers.length ? <Leaderboard workers={workers} /> : <p>There are no backend-verified volunteer rankings to display yet.</p>
        )}
      </div>
    </section>
  );
}

export default LeaderboardPage;
