import { useState, useMemo, useEffect } from "react";
import CampaignFilters from "../components/campaigns/CampaignFilters";
import CampaignGrid from "../components/campaigns/CampaignGrid";
import { getAllCampaigns } from "../services/campaignService";
import { isCampaignPublic, isGoalReached, getDaysLeft } from "../utils/campaignRules";
import "../components/common/Button.css";
import "./Campaigns.css";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "most-raised", label: "Most raised" },
  { value: "nearest-goal", label: "Closest to goal" },
  { value: "ending-soon", label: "Ending soon" },
];

function progressOf(campaign) {
  const goal = Number(campaign.goalAmount) || 0;
  return goal > 0 ? (Number(campaign.raisedAmount) || 0) / goal : 0;
}

function endingKey(campaign) {
  const days = getDaysLeft(campaign.deadline);
  return days === null || days < 0 ? Infinity : days;
}

function sortCampaigns(list, sortBy) {
  const sorted = [...list];
  if (sortBy === "most-raised") {
    sorted.sort((a, b) => (Number(b.raisedAmount) || 0) - (Number(a.raisedAmount) || 0));
  } else if (sortBy === "nearest-goal") {
    sorted.sort(
      (a, b) =>
        Number(isGoalReached(a)) - Number(isGoalReached(b)) || progressOf(b) - progressOf(a)
    );
  } else if (sortBy === "ending-soon") {
    sorted.sort((a, b) => {
      const ka = endingKey(a);
      const kb = endingKey(b);
      if (ka === kb) return 0;
      return ka < kb ? -1 : 1;
    });
  } else {
    sorted.sort(
      (a, b) =>
        Number(Boolean(b.urgent)) - Number(Boolean(a.urgent)) ||
        Number(isGoalReached(a)) - Number(isGoalReached(b))
    );
  }
  return sorted;
}

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBeneficiary, setActiveBeneficiary] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    let isMounted = true;

    getAllCampaigns().then((data) => {
      if (isMounted) {
        setCampaigns(data.filter(isCampaignPublic));
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCampaigns = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const matches = campaigns.filter((campaign) => {
      const matchesCategory =
        activeCategory === "All" || campaign.category === activeCategory;

      const matchesBeneficiary =
        activeBeneficiary === "All" ||
        (campaign.targetBeneficiary && campaign.targetBeneficiary === activeBeneficiary);

      const matchesSearch =
        String(campaign.title || "").toLowerCase().includes(term) ||
        String(campaign.ngo || "").toLowerCase().includes(term) ||
        String(campaign.location || "").toLowerCase().includes(term);

      return matchesCategory && matchesBeneficiary && matchesSearch;
    });
    return sortCampaigns(matches, sortBy);
  }, [campaigns, activeCategory, activeBeneficiary, searchTerm, sortBy]);

  const clearFilters = () => {
    setActiveCategory("All");
    setActiveBeneficiary("All");
    setSearchTerm("");
  };

  return (
    <section className="campaigns-page">
      <div className="container">
        <div className="campaigns-page__header">
          <h1>All Donation Campaigns</h1>
          <p>
            Explore sample community drives. Contributions and XP shown in this demo are stored locally; no payment is processed.
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
        ) : (
          <>
            <div className="campaigns-page__toolbar">
              <p className="campaigns-page__count" aria-live="polite">
                {filteredCampaigns.length} {filteredCampaigns.length === 1 ? "campaign" : "campaigns"} found
              </p>
              <label className="campaigns-page__sort">
                <span>Sort by</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {filteredCampaigns.length === 0 ? (
              <div className="campaigns-page__empty">
                <p>No campaigns match your filters.</p>
                <button type="button" className="btn btn--outline btn--md" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            ) : (
              <CampaignGrid campaigns={filteredCampaigns} />
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default Campaigns;
