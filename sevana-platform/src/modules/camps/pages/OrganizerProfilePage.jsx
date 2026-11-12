import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import OrganizerProfile from "../components/organizers/OrganizerProfile";
import { getOrganizerById } from "../services/organizerService";
import { getAllCamps } from "../services/campService";

function OrganizerProfilePage() {
  const { id } = useParams();
  const [organizer, setOrganizer] = useState(null);
  const [organizerCamps, setOrganizerCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getOrganizerById(id), getAllCamps()]).then(
      ([organizerData, allCamps]) => {
        if (isMounted) {
          setOrganizer(organizerData);
          setOrganizerCamps(
            organizerData ? allCamps.filter((c) => c.organizer === organizerData.name) : []
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
        <p>Loading organizer profile...</p>
      </div>
    );
  }

  if (!organizer) {
    return (
      <div className="container" style={{ padding: "60px 0", textAlign: "center" }}>
        <h2>Organizer not found</h2>
        <Link to="/organizers">← Back to Organizers</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "40px 0 60px" }}>
      <OrganizerProfile organizer={organizer} organizerCamps={organizerCamps} />
    </div>
  );
}

export default OrganizerProfilePage;