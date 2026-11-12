import { useState, useEffect } from "react";
import OrganizerListCard from "../components/organizers/OrganizerListCard";
import { getAllOrganizers } from "../services/organizerService";
import "./Organizers.css";

function Organizers() {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getAllOrganizers().then((data) => {
      if (isMounted) {
        setOrganizers(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="organizers-page">
      <div className="container">
        <div className="organizers-page__header">
          <h1>Our Camp Organizers</h1>
          <p>NGOs, NSS/NCC units, schools, and colleges onboarded to run camps on Sevana.</p>
        </div>

        {loading ? (
          <p className="organizers-page__loading">Loading organizers...</p>
        ) : (
          <div className="organizers-page__grid">
            {organizers.map((org) => (
              <OrganizerListCard key={org.id} organizer={org} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Organizers;