import "./CampaignFilters.css";
import { CAMPAIGN_CATEGORIES, CAMPAIGN_BENEFICIARIES } from "../../utils/constants";

function CampaignFilters({
  activeCategory,
  onCategoryChange,
  activeBeneficiary = "All",
  onBeneficiaryChange,
  searchTerm,
  onSearchChange,
}) {
  return (
    <div className="campaign-filters">
      <input
        type="text"
        className="campaign-filters__search"
        placeholder="Search campaigns by title, NGO, or location..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="campaign-filters__section">
        <span className="campaign-filters__label">Category:</span>
        <div className="campaign-filters__pills">
          {CAMPAIGN_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${activeCategory === cat ? "filter-pill--active" : ""}`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {onBeneficiaryChange && (
        <div className="campaign-filters__section">
          <span className="campaign-filters__label">Beneficiary:</span>
          <div className="campaign-filters__pills">
            {CAMPAIGN_BENEFICIARIES.map((ben) => (
              <button
                key={ben}
                className={`filter-pill ${activeBeneficiary === ben ? "filter-pill--active" : ""}`}
                onClick={() => onBeneficiaryChange(ben)}
              >
                {ben === "Orphanage"
                  ? "🏠 Orphanage"
                  : ben === "Old Age Home"
                  ? "👴 Old Age Home"
                  : ben === "NGO"
                  ? "🤝 NGO"
                  : ben}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CampaignFilters;
