import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { JoinCampProvider } from "../context/JoinCampContext";
import { useJoinCamp } from "../context/useJoinCamp";
import WorkerJoinForm from "../components/join/WorkerJoinForm";
import AttendeeJoinForm from "../components/join/AttendeeJoinForm";
import ContactDetailsStep from "../components/join/ContactDetailsStep";
import JoinConfirmation from "../components/join/JoinConfirmation";
import { getCampById } from "../services/campService";
import "./JoinCamp.css";

function JoinCampStepRenderer({ camp }) {
  const { step, joinData } = useJoinCamp();

  return (
    <div className="join-page__card">
      <div className="join-page__progress">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`join-page__dot ${step >= s ? "join-page__dot--active" : ""}`} />
        ))}
      </div>

      {step === 1 && joinData.role === "worker" && <WorkerJoinForm camp={camp} />}
      {step === 1 && joinData.role === "attendee" && <AttendeeJoinForm camp={camp} />}
      {step === 2 && <ContactDetailsStep />}
      {step === 3 && <JoinConfirmation camp={camp} />}
    </div>
  );
}

function JoinCamp() {
  const { id } = useParams();
  const location = useLocation();
  const { role } = location.state || {};

  const [camp, setCamp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getCampById(id).then((data) => {
      if (isMounted) {
        setCamp(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <div className="container" style={{ padding: "60px 0", textAlign: "center" }}>Loading...</div>;
  }

  if (!camp) {
    return (
      <div className="container" style={{ padding: "60px 0", textAlign: "center" }}>
        <h2>Camp not found</h2>
        <Link to="/camps">← Back to all camps</Link>
      </div>
    );
  }

  return (
    <section className="join-page">
      <div className="container join-page__container">
        <JoinCampProvider initialRole={role} campId={camp.id}>
          <JoinCampStepRenderer camp={camp} />
        </JoinCampProvider>
      </div>
    </section>
  );
}

export default JoinCamp;