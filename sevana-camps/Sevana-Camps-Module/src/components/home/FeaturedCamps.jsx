import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CampCard from "../camps/CampCard";
import Button from "../common/Button";
import { getUpcomingCamps } from "../../services/campService";
import "./FeaturedCamps.css";

function FeaturedCamps() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getUpcomingCamps().then((data) => {
      if (isMounted) {
        setCamps(data.slice(0, 3));
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="featured-camps">
      <div className="container">
        <div className="featured-camps__header">
          <div>
            <h2>Upcoming camps near you</h2>
            <p>Every camp is organized by a verified NGO, school, or NSS/NCC unit.</p>
          </div>
          <Link to="/camps">
            <Button variant="outline">View All Camps</Button>
          </Link>
        </div>

        {loading ? (
          <p className="featured-camps__loading">Loading camps...</p>
        ) : (
          <div className="featured-camps__grid">
            {camps.map((camp) => (
              <CampCard key={camp.id} camp={camp} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedCamps;