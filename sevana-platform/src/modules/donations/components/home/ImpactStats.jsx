import { useEffect, useState } from "react";
import useCountUp from "../../hooks/useCountUp";
import { getAllCampaigns } from "../../services/campaignService";
import mockNGOs from "../../data/mockNGOs";
import "./ImpactStats.css";

const HIDDEN_STATUSES = ["draft", "rejected", "paused"];

function StatCard({ stat }) {
  const count = useCountUp(stat.value, 1800, true);
  const displayValue =
    stat.value >= 100000
      ? (count / 100000).toFixed(1) + "L"
      : count.toLocaleString("en-IN");

  return (
    <div className="stat-card">
      <p className="stat-card__value">
        {stat.prefix || ""}
        {displayValue}
      </p>
      <p className="stat-card__label">{stat.label}</p>
    </div>
  );
}

function ImpactStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getAllCampaigns().then((all) => {
      if (!isMounted) return;
      const live = all.filter((c) => !HIDDEN_STATUSES.includes(c.status));
      setStats([
        { label: "Raised across demo campaigns", value: live.reduce((s, c) => s + (Number(c.raisedAmount) || 0), 0), prefix: "₹" },
        { label: "Donors across campaigns", value: live.reduce((s, c) => s + (Number(c.donorCount) || 0), 0) },
        { label: "Active campaigns", value: live.length },
        { label: "Sample NGO partners", value: mockNGOs.length },
      ]);
    });
    return () => { isMounted = false; };
  }, []);

  if (!stats) return null;

  return (
    <section className="impact-stats">
      <div className="container impact-stats__grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}

export default ImpactStats;