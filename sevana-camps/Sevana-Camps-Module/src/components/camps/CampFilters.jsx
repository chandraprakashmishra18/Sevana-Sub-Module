import "./CampFilters.css";

const campTypes = ["All", "Medical", "Educational"];
const campStatuses = ["Upcoming", "Past"];

function CampFilters({
  activeType,
  onTypeChange,
  activeStatus,
  onStatusChange,
  searchTerm,
  onSearchChange,
}) {
  return (
    <div className="camp-filters">
      <input
        type="text"
        className="camp-filters__search"
        placeholder="Search camps by title or location..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="camp-filters__row">
        <div className="camp-filters__group">
          <span className="camp-filters__label">Type:</span>
          {campTypes.map((type) => (
            <button
              key={type}
              className={`filter-pill ${activeType === type ? "filter-pill--active" : ""}`}
              onClick={() => onTypeChange(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="camp-filters__group">
          <span className="camp-filters__label">Status:</span>
          {campStatuses.map((status) => (
            <button
              key={status}
              className={`filter-pill ${activeStatus === status ? "filter-pill--active" : ""}`}
              onClick={() => onStatusChange(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CampFilters;