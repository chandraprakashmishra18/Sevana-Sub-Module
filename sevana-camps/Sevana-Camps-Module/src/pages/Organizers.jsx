
import { useState, useEffect } from "react";
import OrganizerListCard from "../components/organizers/OrganizerListCard";
import { getAllOrganizers } from "../services/organizerService";
import "./Organizers.css";

function Organizers() {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getAllOrganizers()
      .then((data) => {
        if (isMounted) {
          setOrganizers(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        console.error("Failed to load organizers:", err);

        if (isMounted) {
          setError("Unable to load organizers. Please try again later.");
        }
      })
      .finally(() => {
        if (isMounted) {
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
          <p>
            NGOs, NSS/NCC units, schools, and colleges onboarded
            to run camps on Sevana.
          </p>
        </div>

        {loading ? (
          <p className="organizers-page__loading">
            Loading organizers...
          </p>
        ) : error ? (
          <p className="organizers-page__error">
            {error}
          </p>
        ) : organizers.length === 0 ? (
          <p className="organizers-page__empty">
            No organizers are available yet.
          </p>
        ) : (
          <div className="organizers-page__grid">
            {organizers.map((org) => (
              <OrganizerListCard
                key={org._id}
                organizer={org}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Organizers;
