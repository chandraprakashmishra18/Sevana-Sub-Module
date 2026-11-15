import { Link } from "react-router-dom";
import CampaignCard from "../campaigns/CampaignCard";
import Button from "../common/Button";
import { useEffect, useState } from "react";
import { getAllCampaigns } from "../../services/campaignService";
import "./FeaturedCampaigns.css";

function FeaturedCampaigns() {
  const [featured, setFeatured] = useState([]);
  useEffect(() => { getAllCampaigns().then((campaigns) => setFeatured(campaigns.slice(0, 3))).catch(() => setFeatured([])); }, []);

  return (
    <section className="featured-campaigns">
      <div className="container">
        <div className="featured-campaigns__header">
          <div>
            <h2>Campaigns that need you right now</h2>
            <p>Active community campaigns from the Sevana backend.</p>
          </div>
          <Link to="/campaigns">
            <Button variant="outline">View All Campaigns</Button>
          </Link>
        </div>

        <div className="featured-campaigns__grid">
          {featured.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
          {!featured.length && <p>No active campaigns are available right now.</p>}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCampaigns;
