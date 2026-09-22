import useCountUp from "../../hooks/useCountUp";
import "./CampStats.css";

const stats = [
  { label: "Camps Organized", value: 63, suffix: "+" },
  { label: "People Served", value: 4640, suffix: "+" },
  { label: "Active Volunteers", value: 210, suffix: "+" },
  { label: "Verified Organizers", value: 4, suffix: "" },
];

function StatCard({ stat }) {
  const count = useCountUp(stat.value, 1800, true);

  return (
    <div className="stat-card">
      <p className="stat-card__value">
        {count.toLocaleString("en-IN")}
        {stat.suffix || ""}
      </p>
      <p className="stat-card__label">{stat.label}</p>
    </div>
  );
}

function CampStats() {
  return (
    <section className="camp-stats">
      <div className="container camp-stats__grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}

export default CampStats;