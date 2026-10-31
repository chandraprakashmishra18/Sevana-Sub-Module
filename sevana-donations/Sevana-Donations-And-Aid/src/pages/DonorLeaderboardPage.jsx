import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import mockDonorXPProfiles, { getTierForDonorXP } from "../data/mockDonorXP";
import "./DonorLeaderboardPage.css";

const rankIcons = { 1: "🥇", 2: "🥈", 3: "🥉" };

function DonorLeaderboardPage() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async fetch
    const sorted = [...mockDonorXPProfiles].sort((a, b) => b.totalXP - a.totalXP)
      .map((d, i) => ({ ...d, rank: i + 1 }));
    setDonors(sorted);
    setLoading(false);
  }, []);

  return (
    <section className="donor-leaderboard-page">
      <div className="container">
        <div className="donor-leaderboard-page__header">
          <h1>🏆 Top Donors</h1>
          <p>
            Donors ranked by XP earned across all campaigns. Every contribution
            earns you XP that carries over to your camp volunteer profile.
          </p>
        </div>

        {loading ? (
          <p className="donor-leaderboard-page__loading">Loading leaderboard...</p>
        ) : (
          <>
            <div className="donor-leaderboard">
              {donors.map((donor) => {
                const tier = getTierForDonorXP(donor.totalXP);
                const isTop3 = donor.rank <= 3;
                return (
                  <div
                    key={donor.id}
                    className={`donor-leaderboard-row ${isTop3 ? "donor-leaderboard-row--top3" : ""}`}
                  >
                    <span className="donor-leaderboard-row__rank">
                      {rankIcons[donor.rank] || `#${donor.rank}`}
                    </span>
                    <img
                      src={donor.avatar}
                      alt={donor.name}
                      className="donor-leaderboard-row__avatar"
                    />
                    <div className="donor-leaderboard-row__info">
                      <p className="donor-leaderboard-row__name">{donor.name}</p>
                      <p className="donor-leaderboard-row__donated">
                        ₹{donor.totalDonated.toLocaleString("en-IN")} donated &middot;{" "}
                        {donor.donationCount} donations
                      </p>
                    </div>
                    <span
                      className="donor-leaderboard-row__tier"
                      style={{ backgroundColor: tier.color }}
                    >
                      {tier.name}
                    </span>
                    <span className="donor-leaderboard-row__xp">
                      {donor.totalXP.toLocaleString("en-IN")} XP
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="donor-leaderboard-page__link">
              <Link to="/campaigns">View your donation history</Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default DonorLeaderboardPage;
