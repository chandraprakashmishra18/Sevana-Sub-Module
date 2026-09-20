import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CampHeader from "../components/campDetail/CampHeader";
import CampScheduleInfo from "../components/campDetail/CampScheduleInfo";
import RoleSelector from "../components/campDetail/RoleSelector";
import OrganizerCard from "../components/campDetail/OrganizerCard";
import FeedbackList from "../components/campDetail/FeedbackList";
import { getCampById } from "../services/campService";
import { getAllOrganizers } from "../services/organizerService";
import { getFeedbackByCamp } from "../services/feedbackService";
import "./CampDetail.css";

function CampDetail() {
  const { id } = useParams();
  const [camp, setCamp] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getCampById(id), getAllOrganizers(), getFeedbackByCamp(id)]).then(
      ([campData, allOrganizers, feedbackData]) => {
        if (isMounted) {
          setCamp(campData);
          setOrganizer(
            campData ? allOrganizers.find((o) => o.name === campData.organizer) : null
          );
          setFeedback(feedbackData);
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
      <div className="container camp-detail__not-found">
        <p>Loading camp...</p>
      </div>
    );
  }

  if (!camp) {
    return (
      <div className="container camp-detail__not-found">
        <h2>Camp not found</h2>
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
        </div>

        <div className="camp-detail__sidebar">
          <RoleSelector camp={camp} />
          <OrganizerCard organizer={organizer} />
        </div>
      </div>
    </section>
  );
}

export default CampDetail;