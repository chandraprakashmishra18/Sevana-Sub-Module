import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import mockDonorXPProfiles, { getTierForDonorXP } from "../data/mockDonorXP";
import { getDonationHistory } from "../services/donationService";
import "./DonorLeaderboardPage.css";

const rankIcons = { 1: "🥇", 2: "🥈", 3: "🥉" };

function DonorLeaderboardPage() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async fetch
    const history = getDonationHistory();
    const byEmail = history.reduce((groups, donation) => {
      const email = donation.donorEmail?.toLowerCase();
      if (!email) return groups;
      groups[email] ||= {
        id: `local-${email}`,
        name: donation.donorName || "Community Donor",
        totalXP: 0,
        totalDonated: 0,
        donationCount: 0,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop",
      };
      groups[email].totalXP += donation.xp || 0;
      groups[email].totalDonated += Number(donation.amount) || 0;
      groups[email].donationCount += 1;
      return groups;
    }, {});
    const locals = Object.values(byEmail).filter((local) => !mockDonorXPProfiles.some((donor) => donor.name === local.name));
    const sorted = [...mockDonorXPProfiles, ...locals].sort((a, b) => b.totalXP - a.totalXP)
      .map((d, i) => ({ ...d, rank: i + 1 }));
    setDonors(sorted);
    setLoading(false);
  }, []);

  return (
    <section className="donor-leaderboard-page">
      <div className="container">
        <div className="donor-leaderboard-page__header">
          <h1>🏆 Top Donors Leaderboard</h1>
          <p>
            Recognizing community members who support verified causes for Orphanages, Old Age Homes, NGOs, and student education. Every donation earns XP points!
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
              <Link to="/campaigns">Browse Campaigns to Support &amp; Earn XP</Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default DonorLeaderboardPage;
