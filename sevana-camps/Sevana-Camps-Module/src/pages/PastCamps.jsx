import { useState, useEffect } from "react";
import CampGrid from "../components/camps/CampGrid";
import { getPastCamps } from "../services/campService";
import "./PastCamps.css";

function PastCamps() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getPastCamps().then((data) => {
      if (isMounted) {
        setCamps(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="past-camps-page">
      <div className="container">
        <div className="past-camps-page__header">
          <h1>Past Camps</h1>
          <p>Completed camps with their real outcomes — because impact should be visible, not just promised.</p>
        </div>

        {loading ? (
          <p className="past-camps-page__loading">Loading past camps...</p>
        ) : (
          <CampGrid camps={camps} />
        )}
      </div>
    </section>
  );
}

export default PastCamps;