import CampCard from "../camps/CampCard";
import Badge from "../common/Badge";
import "./OrganizerProfile.css";

function OrganizerProfile({ organizer, organizerCamps }) {
  return (
    <div className="organizer-profile">
      <div className="organizer-profile__cover">
        <img src={organizer.coverImage} alt={`${organizer.name} cover`} />
      </div>

      <div className="organizer-profile__header">
        <img src={organizer.logo} alt={organizer.name} className="organizer-profile__logo" />
        <div>
          <h1>{organizer.name}</h1>
          <p className="organizer-profile__meta">
            {organizer.focusArea} &nbsp;•&nbsp; 📍 {organizer.location}
          </p>
        </div>
      </div>

      <div className="organizer-profile__verification">
        <span className="organizer-profile__verification-icon">🛡️</span>
        <div>
          <p className="organizer-profile__verification-title">
            Verified Organizer <Badge tone="neutral">{organizer.type}</Badge>
          </p>
          <p className="organizer-profile__verification-reg">Reg. No: {organizer.registrationNumber}</p>
        </div>
      </div>

      <p className="organizer-profile__description">{organizer.description}</p>

      <div className="organizer-profile__stats">
        <div className="organizer-profile__stat">
          <strong>{organizer.campsOrganized}</strong>
          <span>Camps Organized</span>
        </div>
        <div className="organizer-profile__stat">
          <strong>{organizer.totalAttendeesServed.toLocaleString("en-IN")}</strong>
          <span>People Served</span>
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