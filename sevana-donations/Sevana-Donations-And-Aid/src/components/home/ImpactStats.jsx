import useCountUp from "../../hooks/useCountUp";
import "./ImpactStats.css";

const stats = [
  { label: "Total Disbursed", value: 2500000, prefix: "₹", suffix: "+" },
  { label: "Families & Students Helped", value: 1840, suffix: "+" },
  { label: "Verified NGO Partners", value: 12, suffix: "" },
  { label: "Donors Who Gave Again", value: 68, suffix: "%" },
];

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
        {stat.suffix || ""}
      </p>
      <p className="stat-card__label">{stat.label}</p>
    </div>
  );
}

function ImpactStats() {
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