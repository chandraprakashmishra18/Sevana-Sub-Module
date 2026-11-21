import CampCard from "../camps/CampCard";
import Badge from "../common/Badge";
import "./OrganizerProfile.css";

function OrganizerProfile({ organizer, organizerCamps }) {
  return (
    <div className="organizer-profile">
      <div className="organizer-profile__header">
        <div className="organizer-profile__logo" aria-hidden="true">{organizer.name.slice(0, 1).toUpperCase()}</div>
        <div>
          <h1>{organizer.name}</h1>
          <p className="organizer-profile__meta">
            {organizer.type} &nbsp;•&nbsp; 📍 {organizer.location || "Location not provided"}
          </p>
        </div>
      </div>

      <div className="organizer-profile__verification">
        <span className="organizer-profile__verification-icon">🛡️</span>
        <div>
          <p className="organizer-profile__verification-title">
            {organizer.verified ? "Verified Organization" : "Organization"} <Badge tone="neutral">{organizer.type}</Badge>
          </p>
          <p className="organizer-profile__verification-reg">Status supplied by Sevana</p>
        </div>
      </div>

      <p className="organizer-profile__description">{organizer.description}</p>

      <div className="organizer-profile__stats">
        <div className="organizer-profile__stat">
          <strong>{organizerCamps.length}</strong>
          <span>Published camps</span>
        </div>
      </div>

      <div className="organizer-profile__camps">
        <h2>Camps by {organizer.name}</h2>
        {organizerCamps.length === 0 ? (
          <p className="organizer-profile__no-camps">
            No camps listed from this organizer right now — check back soon.
          </p>
        ) : (
          <div className="organizer-profile__camps-grid">
            {organizerCamps.map((camp) => (
              <CampCard key={camp.id} camp={camp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrganizerProfile;
