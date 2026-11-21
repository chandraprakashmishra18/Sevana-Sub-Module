import { Link } from "react-router-dom";
import Badge from "../common/Badge";
import Button from "../common/Button";
import "./NGOCard.css";

function NGOCard({ ngo }) {
  return (
    <div className="ngo-card">
      <div className="ngo-card__logo-wrap" aria-hidden="true"><span className="ngo-card__logo">{ngo.name.slice(0, 1).toUpperCase()}</span></div>

      <div className="ngo-card__body">
        <div className="ngo-card__title-row">
          <h3>{ngo.name}</h3>
          {ngo.verified && <Badge tone="verified">Verified</Badge>}
        </div>

        <p className="ngo-card__focus">{ngo.type}</p>
        <p className="ngo-card__location">📍 {ngo.location}</p>

        <div className="ngo-card__stats">
          <div>
            <strong>{ngo.campaignsRun}</strong>
            <span>Campaigns</span>
          </div>
          <div>
            <strong>{ngo.verificationStatus === "VERIFIED" ? "Verified" : "Pending"}</strong>
            <span>Platform status</span>
          </div>
        </div>

        <Link to={`/ngo-partners/${ngo.id}`}>
          <Button variant="outline" size="sm" fullWidth>View Profile</Button>
        </Link>
      </div>
    </div>
  );
}

export default NGOCard;
