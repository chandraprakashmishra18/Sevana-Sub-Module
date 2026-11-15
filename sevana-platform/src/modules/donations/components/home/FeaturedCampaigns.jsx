import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CampaignCard from "../campaigns/CampaignCard";
import { getAllCampaigns } from "../../services/campaignService";
import { isCampaignPublic, isGoalReached } from "../../utils/campaignRules";
import "../common/Button.css";
import "./FeaturedCampaigns.css";

function FeaturedCampaigns() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    let isMounted = true;
    getAllCampaigns().then((all) => {
      if (!isMounted) return;
      const open = all.filter((c) => isCampaignPublic(c) && !isGoalReached(c));
      setFeatured(open.slice(0, 3));
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (featured.length === 0) return null;

  return (
    <section className="featured-campaigns">
      <div className="container">
        <div className="featured-campaigns__header">
          <div>
            <h2>Campaigns that need you right now</h2>
            <p>Sample campaigns from our demo NGO partners.</p>
          </div>
          <Link to="/campaigns" className="btn btn--outline btn--md">
            View All Campaigns
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