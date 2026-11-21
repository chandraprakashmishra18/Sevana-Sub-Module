import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CampHeader from "../components/campDetail/CampHeader";
import CampScheduleInfo from "../components/campDetail/CampScheduleInfo";
import RoleSelector from "../components/campDetail/RoleSelector";
import OrganizerCard from "../components/campDetail/OrganizerCard";
import FeedbackList from "../components/campDetail/FeedbackList";
import FeedbackForm from "../components/feedback/FeedbackForm";
import InvitePanel from "../components/campDetail/InvitePanel";
import { getCampById } from "../services/campService";
import { getFeedbackByCamp } from "../services/feedbackService";
import { useAuth } from "../../../shared/useAuth";
import "./CampDetail.css";

function CampDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [camp, setCamp] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    Promise.all([getCampById(id), getFeedbackByCamp(id)]).then(
      ([campData, feedbackData]) => {
        if (isMounted) {
          setCamp(campData);
          setOrganizer(campData ? { id: campData.organizationId, name: campData.organizer, type: campData.organizationStatus || "Organization" } : null);
          setFeedback(feedbackData);
          setLoading(false);
        }
      }
    ).catch((requestError) => { if (isMounted) { setError(requestError.message || "Unable to load camp details."); setLoading(false); } });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container camp-detail__not-found">
        <p>Loading camp...</p>
      </div>
    );
  }

  if (!camp) {
    return (
      <div className="container camp-detail__not-found">
        <h2>{error ? "Camp details unavailable" : "Camp not found"}</h2>
        {error && <p role="alert">{error}</p>}
        <Link to="/camps">← Back to all camps</Link>
      </div>
    );
  }

  return (
    <section className="camp-detail">
      <div className="container camp-detail__grid">
        <div className="camp-detail__main">
          <CampHeader camp={camp} />
          <CampScheduleInfo camp={camp} />

          {camp.status === "past" && camp.outcomeSummary && (
            <div className="camp-detail__outcome">
              <h2>Outcome</h2>
              <p>{camp.outcomeSummary}</p>
            </div>
          )}

          <FeedbackList feedback={feedback} />
          {camp.publicationStatus === "COMPLETED" && isAuthenticated && <FeedbackForm campId={camp.id} onSubmitted={() => getFeedbackByCamp(camp.id).then(setFeedback)} />}
        </div>

        <div className="camp-detail__sidebar">
          <RoleSelector camp={camp} />
          <OrganizerCard organizer={organizer} />
          {camp.status === "upcoming" && (
            <InvitePanel
              campId={camp.id}
              campTitle={camp.title}
              targetBeneficiary={camp.targetBeneficiary}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default CampDetail;
