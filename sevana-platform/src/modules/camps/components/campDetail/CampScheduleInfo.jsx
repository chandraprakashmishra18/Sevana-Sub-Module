import "./CampScheduleInfo.css";

function CampScheduleInfo({ camp }) {
  const { date, time, location, workerRolesNeeded } = camp;

  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="camp-schedule">
      <h2>Schedule & Details</h2>

      <div className="camp-schedule__grid">
        <div className="camp-schedule__item">
          <span className="camp-schedule__icon">📅</span>
          <div>
            <p className="camp-schedule__label">Date</p>
            <p className="camp-schedule__value">{formattedDate}</p>
          </div>
        </div>

        <div className="camp-schedule__item">
          <span className="camp-schedule__icon">🕒</span>
          <div>
            <p className="camp-schedule__label">Time</p>
            <p className="camp-schedule__value">{time}</p>
          </div>
        </div>

        <div className="camp-schedule__item">
          <span className="camp-schedule__icon">📍</span>
          <div>
            <p className="camp-schedule__label">Location</p>
            <p className="camp-schedule__value">{location}</p>
          </div>
        </div>
      </div>

      {workerRolesNeeded && workerRolesNeeded.length > 0 && (
        <div className="camp-schedule__roles">
          <p className="camp-schedule__label">Worker roles needed</p>
          <div className="camp-schedule__role-tags">
            {workerRolesNeeded.map((role) => (
              <span key={role} className="camp-schedule__role-tag">{role}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CampScheduleInfo;