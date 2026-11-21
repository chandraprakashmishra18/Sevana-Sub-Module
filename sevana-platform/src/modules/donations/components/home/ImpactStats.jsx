import { useEffect, useState } from "react";
import useCountUp from "../../hooks/useCountUp";
import { getAllCampaigns } from "../../services/campaignService";
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
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    getAllCampaigns().then((all) => {
      if (!isMounted) return;
      const live = all.filter((c) => !HIDDEN_STATUSES.includes(c.status));
      setStats([
        { label: "Confirmed funds raised", value: live.reduce((s, c) => s + (Number(c.raisedAmount) || 0), 0), prefix: "₹" },
        { label: "Successful donations recorded", value: live.reduce((s, c) => s + (Number(c.donorCount) || 0), 0) },
        { label: "Active campaigns", value: live.length },
        { label: "Verified organizations", value: new Set(live.map((c) => c.organizationId).filter(Boolean)).size },
      ]);
    }).catch((e) => { if (isMounted) setError(e.message || "Campaign totals are unavailable."); });
    return () => { isMounted = false; };
  }, []);

  if (error) return <section className="impact-stats"><div className="container" role="alert">{error}</div></section>;
  if (!stats) return <section className="impact-stats"><div className="container" role="status">Loading confirmed campaign totals…</div></section>;

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
