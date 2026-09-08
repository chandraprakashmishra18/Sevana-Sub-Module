import "./CampaignFilters.css";

const categories = [
  "All",
  "Student Sponsorship",
  "Family Aid",
  "In-Kind Giving",
];

function CampaignFilters({ activeCategory, onCategoryChange, searchTerm, onSearchChange }) {
  return (
    <div className="campaign-filters">
      <input
        type="text"
        className="campaign-filters__search"
        placeholder="Search campaigns by title or location..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="campaign-filters__pills">
        {categories.map((cat) => (
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
  );
}

export default CampaignFilters;