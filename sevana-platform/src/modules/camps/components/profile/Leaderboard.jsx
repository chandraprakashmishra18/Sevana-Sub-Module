import { Link } from "react-router-dom";
import SafeImage from "../../../../shared/SafeImage";
import TierBadge from "./TierBadge";
import "./Leaderboard.css";

const rankIcons = { 1: "🥇", 2: "🥈", 3: "🥉" };

function Leaderboard({ workers }) {
  return (
    <div className="leaderboard">
      {workers.map((worker) => (
        <Link to={`/profile/${worker.id}`} className="leaderboard-row" key={worker.id}>
          <span className="leaderboard-row__rank">
            {rankIcons[worker.rank] || `#${worker.rank}`}
          </span>
          {worker.avatar ? <SafeImage src={worker.avatar} alt="" className="leaderboard-row__avatar" /> : <span className="leaderboard-row__avatar" aria-hidden="true">{worker.name?.charAt(0) || "?"}</span>}
          <div className="leaderboard-row__info">
            <p className="leaderboard-row__name">{worker.name}</p>
            <p className="leaderboard-row__role">{worker.role || "Community participant"}</p>
          </div>
          <TierBadge totalXP={worker.totalXP} size="sm" />
          <span className="leaderboard-row__xp">{worker.totalXP.toLocaleString("en-IN")} XP</span>
        </Link>
      ))}
    </div>
  );
}

export default Leaderboard;
