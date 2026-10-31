import {
  getXPForDonation,
  getTierForDonorXP,
  getNextDonorTierProgress,
} from "../../data/mockDonorXP";
import "./XPRewardBanner.css";

/**
 * XPRewardBanner — shown after a successful donation.
 * Props:
 *   amount: number — the donation amount in ₹
 *   currentTotalXP: number (optional) — user's existing XP before this donation (default 0)
 */
function XPRewardBanner({ amount, currentTotalXP = 0 }) {
  const earnedXP = getXPForDonation(amount);
  const newTotalXP = currentTotalXP + earnedXP;
  const tier = getTierForDonorXP(newTotalXP);
  const { nextTier, xpNeeded, progressPercent } = getNextDonorTierProgress(newTotalXP);

  if (earnedXP === 0) return null;

  return (
    <div className="xp-reward-banner">
      <div className="xp-reward-banner__celebration">🎉</div>
      <p className="xp-reward-banner__earned">
        You earned <span>+{earnedXP} XP!</span>
      </p>
      <span
        className="xp-reward-banner__tier"
        style={{ backgroundColor: tier.color }}
      >
        {tier.name}
      </span>

      <p className="xp-reward-banner__progress-label">
        Progress to {nextTier || "Max Tier"}
      </p>
      <div className="xp-reward-banner__track">
        <div
          className="xp-reward-banner__fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="xp-reward-banner__progress-meta">
        <span>{newTotalXP.toLocaleString("en-IN")} XP</span>
        {nextTier ? (
          <span>{xpNeeded} XP to {nextTier}</span>
        ) : (
          <span>🏆 Max tier reached!</span>
        )}
      </div>

      <p className="xp-reward-banner__note">
        <strong>Your XP carries across camps &amp; donations!</strong>
      </p>
    </div>
  );
}

export default XPRewardBanner;
