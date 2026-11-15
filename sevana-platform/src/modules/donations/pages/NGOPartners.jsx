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
            Campaigns display their organization from the backend. A public organization directory is not available yet.
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
        {!loading && ngos.length === 0 && <p className="ngo-partners-page__loading">No organization directory data is available. Browse active campaigns to see participating organizations.</p>}
      </div>
    </section>
  );
}

export default NGOPartners;
