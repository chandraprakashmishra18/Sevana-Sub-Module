import "./ProgressBar.css";

// current/total instead of raised/goal — used for camp slot capacity
function ProgressBar({ current, total, label = "filled" }) {
  const percentage = Math.min(Math.round((current / total) * 100), 100);
  const isFull = current >= total;

  return (
    <div className="progress-bar">
      <div className="progress-bar__track">
        <div
          className={`progress-bar__fill ${isFull ? "progress-bar__fill--full" : ""}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="progress-bar__meta">
        <span className="progress-bar__raised">
          {current} of {total} {label}
        </span>
        <span className="progress-bar__percentage">
          {isFull ? "Full" : `${percentage}%`}
        </span>
      </div>
    </div>
  );
}

export default ProgressBar;