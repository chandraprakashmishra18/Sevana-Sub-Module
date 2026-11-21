import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import NGOProfile from "../components/ngo/NGOProfile";
import { getNGOById } from "../services/ngoService";
import { isCampaignPublic } from "../utils/campaignRules";

import { getAllCampaigns } from "../services/campaignService";

function NGOProfilePage() {
  const { id } = useParams();
  const [ngo, setNgo] = useState(null);
  const [ngoCampaigns, setNgoCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    Promise.all([getNGOById(id), getAllCampaigns()]).then(
      ([ngoData, allCampaigns]) => {
        if (isMounted) {
          setNgo(ngoData);
          setNgoCampaigns(
            ngoData ? allCampaigns.filter((c) => c.organizationId === ngoData.id && isCampaignPublic(c)) : []
          );
          setLoading(false);
        }
      }
    ).catch((requestError) => { if (isMounted) { setError(requestError.message || "Unable to load organization details."); setLoading(false); } });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: "60px 0", textAlign: "center" }}>
        <p>Loading NGO profile...</p>
      </div>
    );
  }

  if (!ngo) {
    return (
      <div className="container" style={{ padding: "60px 0", textAlign: "center" }}>
        <h2>{error ? "Unable to load organization" : "Organization not found"}</h2>
        {error && <p role="alert">{error}</p>}
        <Link to="/ngo-partners">← Back to NGO Partners</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "40px 0 60px" }}>
      <NGOProfile ngo={ngo} ngoCampaigns={ngoCampaigns} />
    </div>
  );
}

export default NGOProfilePage;
