import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import NGOProfile from "../components/ngo/NGOProfile";
import { getNGOById } from "../services/ngoService";
import { getAllCampaigns } from "../services/campaignService";

function NGOProfilePage() {
  const { id } = useParams();
  const [ngo, setNgo] = useState(null);
  const [ngoCampaigns, setNgoCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getNGOById(id), getAllCampaigns()]).then(
      ([ngoData, allCampaigns]) => {
        if (isMounted) {
          setNgo(ngoData);
          setNgoCampaigns(
            ngoData ? allCampaigns.filter((c) => c.ngo === ngoData.name) : []
          );
          setLoading(false);
        }
      }
    );

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
        <h2>NGO not found</h2>
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