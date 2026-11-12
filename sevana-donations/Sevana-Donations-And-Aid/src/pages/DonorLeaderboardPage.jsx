import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import mockDonorXPProfiles, { getTierForDonorXP } from "../data/mockDonorXP";
import { getDonationHistory } from "../services/donationService";
import { getUsers } from "../services/authService";
import "./DonorLeaderboardPage.css";

const rankIcons = { 1: "🥇", 2: "🥈", 3: "🥉" };

function DonorLeaderboardPage() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch donation history
    const history = getDonationHistory();
    const historyByEmail = history.reduce((groups, donation) => {
      const email = donation.donorEmail?.toLowerCase();
      if (!email) return groups;
      groups[email] ||= {
        totalXP: 0,
        totalDonated: 0,
        donationCount: 0,
      };
      groups[email].totalXP += donation.xp || 0;
      groups[email].totalDonated += Number(donation.amount) || 0;
      groups[email].donationCount += 1;
      return groups;
    }, {});

    // 2. Fetch real registered users from authService
    const realUsers = getUsers();
    const realDonorMap = {};

    for (const u of realUsers) {
      const email = u.email.toLowerCase();
      const historyStats = historyByEmail[email] || { totalXP: 0, totalDonated: 0, donationCount: 0 };
      const donatedFromUser = Array.isArray(u.donations)
        ? u.donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
        : 0;

      realDonorMap[email] = {
        id: u.id,
        name: u.name,
        avatar: u.avatar,
        role: u.role,
        totalXP: Math.max(u.totalXP || 0, historyStats.totalXP),
        totalDonated: Math.max(donatedFromUser, historyStats.totalDonated),
        donationCount: Math.max((u.donations || []).length, historyStats.donationCount),
      };
    }

    // 3. Merge base mock donor profiles (avoiding duplicate names)
    const combined = Object.values(realDonorMap);
    for (const mock of mockDonorXPProfiles) {
      if (!combined.some((d) => d.name.toLowerCase() === mock.name.toLowerCase())) {
        combined.push(mock);
      }
    }

    // 4. Sort descending by XP
    const sorted = combined
      .sort((a, b) => b.totalXP - a.totalXP)
      .map((d, i) => ({ ...d, rank: i + 1 }));

    setDonors(sorted);
    setLoading(false);
  }, []);

  return (
    <section className="donor-leaderboard-page">
      <div className="container">
        <div className="donor-leaderboard-page__header">
          <h1>🏆 Community Donor Leaderboard</h1>
          <p>
            Recognizing real citizens, volunteers, and donors supporting verified causes for Orphanages, Old Age Homes, NGOs, and education. Every donation earns community XP points!
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
                        ₹{(donor.totalDonated || 0).toLocaleString("en-IN")} contributed &middot;{" "}
                        {donor.donationCount || 0} donations
                      </p>
                    </div>
                    <span
                      className="donor-leaderboard-row__tier"
                      style={{ backgroundColor: tier.color }}
                    >
                      {tier.name}
                    </span>
                    <span className="donor-leaderboard-row__xp">
                      {(donor.totalXP || 0).toLocaleString("en-IN")} XP
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
