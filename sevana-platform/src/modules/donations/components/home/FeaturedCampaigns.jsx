import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CampaignCard from "../campaigns/CampaignCard";
import { getAllCampaigns } from "../../services/campaignService";
import { isCampaignPublic, isGoalReached } from "../../utils/campaignRules";
import "../common/Button.css";
import "./FeaturedCampaigns.css";

function FeaturedCampaigns() {
  const [featured, setFeatured] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    getAllCampaigns().then((all) => {
      if (!isMounted) return;
      const open = all.filter((c) => isCampaignPublic(c) && !isGoalReached(c));
      setFeatured(open.slice(0, 3));
    }).catch((requestError) => { if (isMounted) setError(requestError.message || "Campaign highlights are unavailable."); });
    return () => {
      isMounted = false;
    };
  }, []);

  if (error) return <section className="featured-campaigns"><div className="container" role="alert">{error}</div></section>;
  if (featured.length === 0) return null;

  return (
    <section className="featured-campaigns">
      <div className="container">
        <div className="featured-campaigns__header">
          <div>
            <h2>Campaigns that need you right now</h2>
            <p>Current campaigns published by verified organizations.</p>
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
