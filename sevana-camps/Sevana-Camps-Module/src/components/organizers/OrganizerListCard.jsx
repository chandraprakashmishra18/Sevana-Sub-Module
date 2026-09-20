import { Link } from "react-router-dom";
import Badge from "../common/Badge";
import Button from "../common/Button";
import "./OrganizerListCard.css";

function OrganizerListCard({ organizer }) {
  return (
    <div className="organizer-list-card">
      <div className="organizer-list-card__logo-wrap">
        <img src={organizer.logo} alt={organizer.name} className="organizer-list-card__logo" />
      </div>

      <div className="organizer-list-card__body">
        <div className="organizer-list-card__title-row">
          <h3>{organizer.name}</h3>
          {organizer.verified && <Badge tone="verified">✔ Verified</Badge>}
        </div>

        <Badge tone="neutral">{organizer.type}</Badge>
        <p className="organizer-list-card__focus">{organizer.focusArea}</p>
        <p className="organizer-list-card__location">📍 {organizer.location}</p>

        <div className="organizer-list-card__stats">
          <div>
            <strong>{organizer.campsOrganized}</strong>
            <span>Camps Organized</span>
          </div>
          <div>
            <strong>{organizer.totalAttendeesServed.toLocaleString("en-IN")}</strong>
            <span>People Served</span>
          </div>
        </div>

        <Link to={`/organizers/${organizer.id}`}>
          <Button variant="outline" size="sm" fullWidth>View Profile</Button>
        </Link>
      </div>
    </div>
  );
}

export default OrganizerListCard;