import CampCard from "./CampCard";
import "./CampGrid.css";

function CampGrid({ camps }) {
  if (camps.length === 0) {
    return (
      <div className="camp-grid__empty">
        <p>No camps match your search. Try a different filter.</p>
      </div>
    );
  }

  return (
    <div className="camp-grid">
      {camps.map((camp) => (
        <CampCard key={camp.id} camp={camp} />
      ))}
    </div>
  );
}

export default CampGrid;