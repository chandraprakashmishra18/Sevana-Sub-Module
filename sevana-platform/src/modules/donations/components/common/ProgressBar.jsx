import "./ProgressBar.css";

// percentage is calculated from raised/goal, capped at 100
function ProgressBar({ raised, goal }) {
  const percentage = goal > 0 ? Math.min(Math.round((Number(raised || 0) / goal) * 100), 100) : 0;

  return (
    <div className="progress-bar">
      <div className="progress-bar__track">
        <div
          className="progress-bar__fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="progress-bar__meta">
        <span className="progress-bar__raised">
          ₹{Number(raised || 0).toLocaleString("en-IN")} raised
        </span>
        <span className="progress-bar__percentage">{percentage}%</span>
      </div>
    </div>
  );
}

export default ProgressBar;
