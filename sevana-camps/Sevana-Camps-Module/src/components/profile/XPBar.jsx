import { getNextTierProgress } from "../../data/mockWorkers";
import "./XPBar.css";

function XPBar({ totalXP }) {
  const { nextTier, xpNeeded, progressPercent } = getNextTierProgress(totalXP);

  return (
    <div className="xp-bar">
      <div className="xp-bar__track">
        <div className="xp-bar__fill" style={{ width: `${progressPercent}%` }}></div>
      </div>
      <div className="xp-bar__meta">
        <span className="xp-bar__current">{totalXP.toLocaleString("en-IN")} XP</span>
        {nextTier ? (
          <span className="xp-bar__next">{xpNeeded} XP to {nextTier}</span>
        ) : (
          <span className="xp-bar__next">Max tier reached</span>
        )}
      </div>
    </div>
  );
}

export default XPBar;