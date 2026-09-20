import { getTierForXP } from "../../data/mockWorkers";
import "./TierBadge.css";

function TierBadge({ totalXP, size = "md" }) {
  const tier = getTierForXP(totalXP);

  return (
    <div
      className={`tier-badge tier-badge--${size}`}
      style={{ backgroundColor: tier.color }}
    >
      {tier.name}
    </div>
  );
}

export default TierBadge;