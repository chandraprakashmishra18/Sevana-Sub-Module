import { Link } from "react-router-dom";
import Badge from "../common/Badge";
import ProgressBar from "../common/ProgressBar";
import Button from "../common/Button";
import "./CampCard.css";

const FALLBACK_IMAGE = "https://picsum.photos/seed/camp-fallback/600/400";

function CampCard({ camp }) {
  const {
    id,
    title,
    type,
    organizer,
    organizerVerified,
    image,
    date,
    location,
    workerSlots,
    attendeeSlots,
    status,
  } = camp;

  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const hasAttendeeSlots = attendeeSlots && attendeeSlots.total > 0;

  return (
    <div className="camp-card">
      <div className="camp-card__image-wrap">
        <img
          src={image}
          alt={title}
          className="camp-card__image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMAGE;
          }}
        />
        <div className="camp-card__badges">
          {status === "past" && <Badge tone="neutral">Completed</Badge>}
          <Badge tone={type === "Medical" ? "medical" : "educational"}>{type}</Badge>
        </div>
      </div>

      <div className="camp-card__body">
        <p className="camp-card__organizer">
          {organizer}
          {organizerVerified && <span className="camp-card__verified">✔ Verified</span>}
        </p>

        <h3 className="camp-card__title">{title}</h3>
        <p className="camp-card__meta">📅 {formattedDate} &nbsp;•&nbsp; 📍 {location}</p>

        <ProgressBar
          current={workerSlots.filled}
          total={workerSlots.total}
          label="worker slots filled"
        />

        {hasAttendeeSlots && (
          <div className="camp-card__attendee-progress">
            <ProgressBar
              current={attendeeSlots.filled}
              total={attendeeSlots.total}
              label="attendee slots filled"
            />
          </div>
        )}

        <div className="camp-card__footer">
          <Link to={`/camps/${id}`}>
            <Button variant="primary" size="sm" fullWidth>
              {status === "past" ? "View Outcome" : "View & Join"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CampCard;