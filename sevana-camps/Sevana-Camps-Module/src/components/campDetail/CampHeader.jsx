import Badge from "../common/Badge";
import "./CampHeader.css";

function CampHeader({ camp }) {
  const { title, type, organizer, organizerVerified, image, status, description } = camp;

  return (
    <div className="camp-header">
      <div className="camp-header__image-wrap">
        <img src={image} alt={title} className="camp-header__image" />
      </div>

      <div className="camp-header__badges">
        {status === "past" && <Badge tone="neutral">Completed</Badge>}
        <Badge tone={type === "Medical" ? "medical" : "educational"}>{type}</Badge>
      </div>

      <h1 className="camp-header__title">{title}</h1>

      <p className="camp-header__meta">
        Organised by <strong>{organizer}</strong>
        {organizerVerified && <span className="camp-header__verified"> ✔ Verified Organizer</span>}
      </p>

      <div className="camp-header__story">
        <h2>About This Camp</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default CampHeader;