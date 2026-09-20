import { useState, useEffect, useMemo } from "react";
import CampFilters from "../components/camps/CampFilters";
import CampGrid from "../components/camps/CampGrid";
import { getAllCamps } from "../services/campService";
import "./Camps.css";

function Camps() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("All");
  const [activeStatus, setActiveStatus] = useState("Upcoming");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;

    getAllCamps().then((data) => {
      if (isMounted) {
        setCamps(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCamps = useMemo(() => {
    return camps.filter((camp) => {
      const matchesType = activeType === "All" || camp.type === activeType;
      const matchesStatus = camp.status === activeStatus.toLowerCase();
      const matchesSearch =
        camp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camp.location.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesType && matchesStatus && matchesSearch;
    });
  }, [camps, activeType, activeStatus, searchTerm]);

  return (
    <section className="camps-page">
      <div className="container">
        <div className="camps-page__header">
          <h1>All Camps</h1>
          <p>Browse medical and educational camps organized by verified NGOs, schools, and NSS/NCC units.</p>
        </div>

        <CampFilters
          activeType={activeType}
          onTypeChange={setActiveType}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {loading ? (
          <p className="camps-page__loading">Loading camps...</p>
        ) : (
          <CampGrid camps={filteredCamps} />
        )}
      </div>
    </section>
  );
}

export default Camps;