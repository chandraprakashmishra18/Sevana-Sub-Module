import { Link } from "react-router-dom";
import "./OrganizerCard.css";

function OrganizerCard({ organizer }) {
  if (!organizer) return null;

  return (
    <Link to={`/organizers/${organizer.id}`} className="organizer-card">
      <img src={organizer.logo} alt={organizer.name} className="organizer-card__logo" />
      <div>
        <p className="organizer-card__label">Organized by</p>
        <p className="organizer-card__name">{organizer.name}</p>
        <p className="organizer-card__type">{organizer.type}</p>
      </div>
      <span className="organizer-card__arrow">→</span>
    </Link>
  );
}

export default OrganizerCard;