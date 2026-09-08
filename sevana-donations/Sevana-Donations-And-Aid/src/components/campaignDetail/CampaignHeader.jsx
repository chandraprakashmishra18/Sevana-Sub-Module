import Badge from "../common/Badge";
import "./CampaignHeader.css";

function CampaignHeader({ campaign }) {
  const { title, category, ngo, ngoVerified, image, location, urgent, description } = campaign;

  return (
    <div className="campaign-header">
      <div className="campaign-header__image-wrap">
        <img src={image} alt={title} className="campaign-header__image" />
      </div>

      <div className="campaign-header__badges">
        {urgent && <Badge tone="urgent">Urgent</Badge>}
        <Badge tone="info">{category}</Badge>
      </div>

      <h1 className="campaign-header__title">{title}</h1>

      <p className="campaign-header__meta">
        📍 {location} &nbsp;•&nbsp; Organised by{" "}
        <strong>{ngo}</strong>
        {ngoVerified && <span className="campaign-header__verified"> ✔ Verified NGO</span>}
      </p>

      <div className="campaign-header__story">
        <h2>The Story</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default CampaignHeader;