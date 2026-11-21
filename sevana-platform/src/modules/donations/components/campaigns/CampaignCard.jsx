import { Link } from "react-router-dom";
import Badge from "../common/Badge";
import ProgressBar from "../common/ProgressBar";
import { isGoalReached, getDaysLeft } from "../../utils/campaignRules";
import SafeImage from "../../../../shared/SafeImage";
import "./CampaignCard.css";

function CampaignCard({ campaign }) {
  const {
    id,
    title,
    category,
    targetBeneficiary,
    ngo,
    ngoVerified,
    image,
    goalAmount,
    raisedAmount,
    donorCount,
    location,
    urgent,
  } = campaign;

  const goalReached = isGoalReached(campaign);
const daysLeft = getDaysLeft(campaign.deadline);
  return (
    <div className="campaign-card">
      <div className="campaign-card__image-wrap">
        <SafeImage
          src={image}
          alt={title}
          className="campaign-card__image"
        />
        <div className="campaign-card__badges">
          {urgent && !goalReached && <Badge tone="urgent">Urgent</Badge>}
          {goalReached && <Badge tone="verified">Goal reached</Badge>}
          <Badge tone="info">{category}</Badge>
          {targetBeneficiary && <Badge tone="verified">{targetBeneficiary}</Badge>}
        </div>
      </div>

      <div className="campaign-card__body">
        <p className="campaign-card__ngo">
          {ngo}
          {ngoVerified && <span className="campaign-card__verified">Verified</span>}
        </p>

        <h3 className="campaign-card__title">{title}</h3>
        <p className="campaign-card__location">📍 {location}</p>
        {daysLeft !== null && !goalReached && (
  <p className="campaign-card__days">
    {daysLeft >= 0
      ? daysLeft + (daysLeft === 1 ? " day left" : " days left")
      : "Campaign ended"}
  </p>
)}


        <ProgressBar raised={raisedAmount} goal={goalAmount} />

        <div className="campaign-card__footer">
          <span className="campaign-card__donors">{donorCount} donors</span>
          <Link
            to={`/campaigns/${id}`}
            className={`btn btn--sm ${goalReached ? "btn--outline" : "btn--accent"}`}
          >
            {goalReached ? "View campaign" : "Donate"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CampaignCard;
