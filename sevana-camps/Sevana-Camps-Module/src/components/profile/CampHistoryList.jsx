import { Link } from "react-router-dom";
import "./CampHistoryList.css";

function CampHistoryList({ campsWorked, allCamps }) {
  if (!campsWorked || campsWorked.length === 0) {
    return (
      <div className="camp-history">
        <h3>Camp History</h3>
        <p className="camp-history__empty">No camps worked yet — browse camps to get started.</p>
      </div>
    );
  }

  return (
    <div className="camp-history">
      <h3>Camp History ({campsWorked.length})</h3>
      {campsWorked.map((entry, index) => {
        const camp = allCamps.find((c) => c.id === entry.campId);
        return (
          <div className="camp-history-item" key={index}>
            <div>
              <Link to={`/camps/${entry.campId}`} className="camp-history-item__title">
                {camp ? camp.title : "Unknown camp"}
              </Link>
              <p className="camp-history-item__role">
                {entry.role} &nbsp;•&nbsp; {new Date(entry.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            <span className="camp-history-item__xp">+{entry.xpEarned} XP</span>
          </div>
        );
      })}
    </div>
  );
}

export default CampHistoryList;