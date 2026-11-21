import { useState, useEffect } from "react";
import NGOCard from "../components/ngo/NGOCard";
import { getAllNGOs } from "../services/ngoService";
import "./NGOPartners.css";

function NGOPartners() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getAllNGOs().then((data) => {
      if (isMounted) {
        setNgos(data);
        setLoading(false);
      }
    }).catch((requestError) => { if (isMounted) { setError(requestError.message || "Unable to load organizations."); setLoading(false); } });

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
            Browse organizations verified and published by the backend.
          </p>
        </div>

        {loading ? (
          <p className="ngo-partners-page__loading">Loading NGO partners...</p>
        ) : error ? <p role="alert">{error}</p> : (
          <div className="ngo-partners-page__grid">
            {ngos.map((ngo) => (
              <NGOCard key={ngo.id} ngo={ngo} />
            ))}
            {!ngos.length && <p>No verified organizations are listed yet.</p>}
          </div>
        )}
      </div>
    </section>
  );
}

export default NGOPartners;
