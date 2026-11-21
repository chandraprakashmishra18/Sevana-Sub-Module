import { Link } from "react-router-dom";
import Badge from "../common/Badge";
import Button from "../common/Button";
import "./OrganizerListCard.css";

function OrganizerListCard({ organizer }) {
  return (
    <div className="organizer-list-card">
      <div className="organizer-list-card__logo-wrap" aria-hidden="true"><span className="organizer-list-card__logo">{organizer.name.slice(0, 1).toUpperCase()}</span></div>

      <div className="organizer-list-card__body">
        <div className="organizer-list-card__title-row">
          <h3>{organizer.name}</h3>
          {organizer.verified && <Badge tone="verified">✔ Verified</Badge>}
        </div>

        <Badge tone="neutral">{organizer.type}</Badge>
        <p className="organizer-list-card__focus">{organizer.description || "Organization profile"}</p>
        <p className="organizer-list-card__location">📍 {organizer.location || "Location not provided"}</p>

        <div className="organizer-list-card__stats">
          <div>
            <strong>{organizer._count?.camps || 0}</strong>
            <span>Camps listed</span>
          </div>
          <div>
            <strong>{organizer.verificationStatus === "VERIFIED" ? "Verified" : "Pending"}</strong>
            <span>Platform status</span>
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
