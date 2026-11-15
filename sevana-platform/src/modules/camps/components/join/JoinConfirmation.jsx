import { useState } from "react";
import { Link } from "react-router-dom";
import { useJoinCamp } from "../../context/useJoinCamp";
import { submitJoinCamp } from "../../services/joinService";
import Button from "../common/Button";
import "./JoinConfirmation.css";

function JoinConfirmation({ camp }) {
  const { joinData, prevStep } = useJoinCamp();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const result = await submitJoinCamp({ ...joinData, campId: camp.id, campTitle: camp.title });
      if (result.success) setSubmitted(true);
    } catch (err) { setError(err.message || "Could not register for this camp."); }
    finally { setSubmitting(false); }
  };

  if (submitted) {
    return (
      <div className="join-confirmation join-confirmation--success">
        <div className="join-confirmation__icon">🎉</div>
        <h2>Registration received, {joinData.fullName.split(" ")[0]}.</h2>
        
        <div className="join-confirmation__xp-badge">
          <strong>Registration status: pending review</strong>
        </div>

        <p>
          Your registration for <strong>{camp.title}</strong> was recorded as{" "}
          {joinData.role === "worker" ? "a volunteer" : "a beneficiary"}. The backend will confirm whether you are registered or waitlisted.
        </p>

        <div className="join-confirmation__actions">
          <Link to={`/camps/${camp.id}`}><Button variant="primary">Back to Camp</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="join-step">
      <h2>Step 3 of 3 — Review &amp; Confirm</h2>

      <div className="join-confirmation__review">
        <div className="join-confirmation__row">
          <span>Camp</span>
          <strong>{camp.title}</strong>
        </div>
        <div className="join-confirmation__row">
          <span>Target Beneficiary</span>
          <strong>{camp.targetBeneficiary || "General Community"}</strong>
        </div>
        <div className="join-confirmation__row">
          <span>Joining as</span>
          <strong>{joinData.role === "worker" ? "Volunteer Worker" : "Attendee"}</strong>
        </div>
        <div className="join-confirmation__row">
          <span>Name</span>
          <strong>{joinData.fullName}</strong>
        </div>
        <div className="join-confirmation__row">
          <span>Email</span>
          <strong>{joinData.email}</strong>
        </div>
        <div className="join-confirmation__row">
          <span>Phone</span>
          <strong>{joinData.phone}</strong>
        </div>
        {joinData.role === "worker" ? (
          <>
            <div className="join-confirmation__row">
              <span>Role / Skill</span>
              <strong>{joinData.skillOrProfession}</strong>
            </div>
            <div className="join-confirmation__row">
              <span>Availability</span>
              <strong>{joinData.availability}</strong>
            </div>
            <div className="join-confirmation__row">
            </div>
          </>
        ) : (
          <>
            <div className="join-confirmation__row">
              <span>Age Group</span>
              <strong>{joinData.ageGroup}</strong>
            </div>
            <div className="join-confirmation__row">
            </div>
          </>
        )}
      </div>

      {error && <p role="alert" className="join-confirmation__error">{error}</p>}

      <div className="join-step__actions">
        <Button variant="ghost" onClick={prevStep} disabled={submitting}>← Back</Button>
        <Button variant="accent" size="lg" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Confirm & Join Camp"}
        </Button>
      </div>
    </div>
  );
}

export default JoinConfirmation;
