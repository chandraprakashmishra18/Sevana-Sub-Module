import Badge from "../common/Badge";
import SafeImage from "../../../../shared/SafeImage";
import "./CampaignHeader.css";

function CampaignHeader({ campaign }) {
  const {
    title,
    category,
    targetBeneficiary,
    ngo,
    ngoVerified,
    image,
    location,
    urgent,
    description,
    deadline,
    resources,
  } = campaign;

  return (
    <div className="campaign-header">
      <div className="campaign-header__image-wrap">
        <SafeImage src={image} alt={title} className="campaign-header__image" />
      </div>

      <div className="campaign-header__badges">
        {urgent && <Badge tone="urgent">Urgent</Badge>}
        <Badge tone="info">{category}</Badge>
        {targetBeneficiary && (
          <Badge tone="verified">
            {targetBeneficiary === "Orphanage"
              ? "Orphanage"
              : targetBeneficiary === "Old Age Home"
              ? "Old Age Home"
              : targetBeneficiary === "NGO"
              ? "NGO"
              : "Community"}
          </Badge>
        )}
      </div>

      <h1 className="campaign-header__title">{title}</h1>

      <p className="campaign-header__meta">
        📍 {location} &nbsp;•&nbsp; Organised by{" "}
        <strong>{ngo}</strong>
        {ngoVerified && <span className="campaign-header__verified"> Verified NGO</span>}
      </p>

      {(deadline || resources) && (
        <dl className="campaign-header__facts">
          {deadline && (
            <div>
              <dt>Deadline</dt>
              <dd>
                {new Date(`${deadline}T00:00:00`).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </dd>
            </div>
          )}
          {resources && (
            <div>
              <dt>Resources needed</dt>
              <dd>{resources}</dd>
            </div>
          )}
        </dl>
      )}

      <div className="campaign-header__story">
        <h2>The Story</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default CampaignHeader;
