import { useState, useMemo, useEffect } from "react";
import CampaignFilters from "../components/campaigns/CampaignFilters";
import CampaignGrid from "../components/campaigns/CampaignGrid";
import { getAllCampaigns } from "../services/campaignService";
import "./Campaigns.css";

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBeneficiary, setActiveBeneficiary] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getAllCampaigns().then((data) => {
      if (isMounted) {
        setCampaigns(data);
        setLoading(false);
      }
    }).catch((err) => { if (isMounted) { setError(err.message || "Could not load campaigns."); setLoading(false); } });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const matchesCategory =
        activeCategory === "All" || campaign.category === activeCategory;

      const matchesBeneficiary =
        activeBeneficiary === "All" ||
        (campaign.targetBeneficiary && campaign.targetBeneficiary === activeBeneficiary);

      const matchesSearch =
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.ngo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.location.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesBeneficiary && matchesSearch;
    });
  }, [campaigns, activeCategory, activeBeneficiary, searchTerm]);

  return (
    <section className="campaigns-page">
      <div className="container">
        <div className="campaigns-page__header">
          <h1>All Donation Campaigns</h1>
          <p>
            Explore active community campaigns. Donations remain pending until a payment provider confirms them.
          </p>
        </div>

        <CampaignFilters
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          activeBeneficiary={activeBeneficiary}
          onBeneficiaryChange={setActiveBeneficiary}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {loading ? (
          <p className="campaigns-page__loading">Loading campaigns...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : (
          <CampaignGrid campaigns={filteredCampaigns} />
        )}
      </div>
    </section>
  );
}

export default Campaigns;
