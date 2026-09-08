import { useState, useMemo, useEffect } from "react";
import CampaignFilters from "../components/campaigns/CampaignFilters";
import CampaignGrid from "../components/campaigns/CampaignGrid";
import { getAllCampaigns } from "../services/campaignService";
import "./Campaigns.css";

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;

    getAllCampaigns().then((data) => {
      if (isMounted) {
        setCampaigns(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const matchesCategory =
        activeCategory === "All" || campaign.category === activeCategory;

      const matchesSearch =
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.location.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [campaigns, activeCategory, searchTerm]);

  return (
    <section className="campaigns-page">
      <div className="container">
        <div className="campaigns-page__header">
          <h1>All Campaigns</h1>
          <p>Browse verified student sponsorships, family aid requests, and NGO drives.</p>
        </div>

        <CampaignFilters
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {loading ? (
          <p className="campaigns-page__loading">Loading campaigns...</p>
        ) : (
          <CampaignGrid campaigns={filteredCampaigns} />
        )}
      </div>
    </section>
  );
}

export default Campaigns;