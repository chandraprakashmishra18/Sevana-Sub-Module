import { Link } from "react-router-dom";
import CampaignCard from "../campaigns/CampaignCard";
import Button from "../common/Button";
import mockCampaigns from "../../data/mockCampaigns";
import "./FeaturedCampaigns.css";

function FeaturedCampaigns() {
  // Show only the first 3 on the homepage
  const featured = mockCampaigns.slice(0, 3);

  return (
    <section className="featured-campaigns">
      <div className="container">
        <div className="featured-campaigns__header">
          <div>
            <h2>Campaigns that need you right now</h2>
            <p>Every listing below is NGO-verified and actively raising funds.</p>
          </div>
          <Link to="/campaigns">
            <Button variant="outline">View All Campaigns</Button>
          </Link>
        </div>

        <div className="featured-campaigns__grid">
          {featured.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCampaigns;