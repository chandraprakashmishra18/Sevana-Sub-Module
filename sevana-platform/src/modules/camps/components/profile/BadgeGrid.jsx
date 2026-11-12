import "./BadgeGrid.css";

// Maps badge names to emoji icons for visual variety
const badgeIcons = {
  "First Camp": "🎉",
  "5 Camps Milestone": "🏅",
  "10 Camps Milestone": "🏆",
  "Medical Specialist": "⚕️",
  "Consistency Champion": "🔥",
};

function BadgeGrid({ badges }) {
  if (!badges || badges.length === 0) {
    return (
      <div className="badge-grid">
        <h3>Badges</h3>
        <p className="badge-grid__empty">No badges earned yet — join a camp to start earning them.</p>
      </div>
    );
  }

  return (
    <div className="badge-grid">
      <h3>Badges ({badges.length})</h3>
      <div className="badge-grid__items">
        {badges.map((badge) => (
          <div className="badge-item" key={badge}>
            <span className="badge-item__icon">{badgeIcons[badge] || "🎖️"}</span>
            <span className="badge-item__name">{badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BadgeGrid;