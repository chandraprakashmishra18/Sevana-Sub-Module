import { useEffect, useState } from "react";
import useCountUp from "../../hooks/useCountUp";
import { getAllCamps } from "../../services/campService";
import { getAllOrganizers } from "../../services/organizerService";
import "./CampStats.css";

function StatCard({ stat }) {
  const count = useCountUp(stat.value, 1200, true);
  return <div className="stat-card"><p className="stat-card__value">{count.toLocaleString("en-IN")}</p><p className="stat-card__label">{stat.label}</p></div>;
}

export default function CampStats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    Promise.all([getAllCamps(), getAllOrganizers()]).then(([camps, organizations]) => {
      if (!active) return;
      const verifiedOrgIds = new Set(organizations.filter((item) => item.verified).map((item) => item.id));
      setStats([
        { label: "Published camp records", value: camps.filter((camp) => camp.publicationStatus === "PUBLISHED").length },
        { label: "Confirmed registrations", value: camps.reduce((total, camp) => total + Number(camp.registrationCounts?.total || 0), 0) },
        { label: "Verified organizations", value: verifiedOrgIds.size },
      ]);
    }).catch((requestError) => { if (active) setError(requestError.message || "Camp activity is unavailable."); });
    return () => { active = false; };
  }, []);
  if (error) return <section className="camp-stats"><div className="container" role="alert">{error}</div></section>;
  if (!stats) return <section className="camp-stats"><div className="container" role="status">Loading camp activity…</div></section>;
  return <section className="camp-stats"><div className="container camp-stats__grid">{stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}</div></section>;
}
