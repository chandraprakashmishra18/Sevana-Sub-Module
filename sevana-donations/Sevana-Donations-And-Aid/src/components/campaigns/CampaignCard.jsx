import { Link } from "react-router-dom";
import Badge from "../common/Badge";
import ProgressBar from "../common/ProgressBar";
import Button from "../common/Button";
import "./CampaignCard.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&auto=format&fit=crop";

function CampaignCard({ campaign }) {
  const {
    id,
    title,
    category,
    ngo,
    ngoVerified,
    image,
    goalAmount,
    raisedAmount,
    donorCount,
    location,
    urgent,
  } = campaign;

  return (
    <div className="campaign-card">
      <div className="campaign-card__image-wrap">
        <img
          src={image}
          alt={title}
          className="campaign-card__image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMAGE;
          }}
        />
        <div className="campaign-card__badges">
          {urgent && <Badge tone="urgent">Urgent</Badge>}
          <Badge tone="info">{category}</Badge>
        </div>
      </div>

      <div className="campaign-card__body">
        <p className="campaign-card__ngo">
          {ngo}
          {ngoVerified && <span className="campaign-card__verified">✔ Verified</span>}
        </p>

        <h3 className="campaign-card__title">{title}</h3>
        <p className="campaign-card__location">📍 {location}</p>

        <ProgressBar raised={raisedAmount} goal={goalAmount} />

        <div className="campaign-card__footer">
          <span className="campaign-card__donors">{donorCount} donors</span>
          <Link to={`/campaigns/${id}`}>
            <Button variant="primary" size="sm">Donate</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CampaignCard;