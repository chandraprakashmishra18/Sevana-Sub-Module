import CampaignCard from "./CampaignCard";
import "./CampaignGrid.css";

function CampaignGrid({ campaigns }) {
  if (campaigns.length === 0) {
    return (
      <div className="campaign-grid__empty">
        <p>No campaigns match your search. Try a different filter.</p>
      </div>
    );
  }

  return (
    <div className="campaign-grid">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}

export default CampaignGrid;