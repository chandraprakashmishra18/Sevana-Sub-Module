import { useState, useEffect } from "react";
import NGOCard from "../components/ngo/NGOCard";
import { getAllNGOs } from "../services/ngoService";
import "./NGOPartners.css";

function NGOPartners() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getAllNGOs().then((data) => {
      if (isMounted) {
        setNgos(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="ngo-partners-page">
      <div className="container">
        <div className="ngo-partners-page__header">
          <h1>Our NGO Partners</h1>
          <p>
            Every campaign on Sevana is signed off by one of these verified,
            registered NGO partners before it goes live.
          </p>
        </div>

        {loading ? (
          <p className="ngo-partners-page__loading">Loading NGO partners...</p>
        ) : (
          <div className="ngo-partners-page__grid">
            {ngos.map((ngo) => (
              <NGOCard key={ngo.id} ngo={ngo} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default NGOPartners;