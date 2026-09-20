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

  const handleSubmit = async () => {
    setSubmitting(true);
    const result = await submitJoinCamp(joinData);
    if (result.success) {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="join-confirmation join-confirmation--success">
        <div className="join-confirmation__icon">🎉</div>
        <h2>You're in, {joinData.fullName.split(" ")[0]}!</h2>
        <p>
          You've successfully joined <strong>{camp.title}</strong> as{" "}
          {joinData.role === "worker" ? "a worker" : "an attendee"}. A confirmation
          has been sent to {joinData.email}.
        </p>
        {joinData.role === "worker" && (
          <p className="join-confirmation__xp-note">
            You'll earn XP once the camp is marked complete by the organizer.
          </p>
        )}
        <div className="join-confirmation__actions">
          <Link to="/camps"><Button variant="outline">Browse More Camps</Button></Link>
          <Link to={`/camps/${camp.id}`}><Button variant="primary">Back to Camp</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="join-step">
      <h2>Step 3 of 3 — Review & Confirm</h2>

      <div className="join-confirmation__review">
        <div className="join-confirmation__row">
          <span>Camp</span>
          <strong>{camp.title}</strong>
        </div>
        <div className="join-confirmation__row">
          <span>Joining as</span>
          <strong>{joinData.role === "worker" ? "Worker" : "Attendee"}</strong>
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
              <span>Role</span>
              <strong>{joinData.skillOrProfession}</strong>
            </div>
            <div className="join-confirmation__row">
              <span>Availability</span>
              <strong>{joinData.availability}</strong>
            </div>
          </>
        ) : (
          <div className="join-confirmation__row">
            <span>Age Group</span>
            <strong>{joinData.ageGroup}</strong>
          </div>
        )}
      </div>

      <div className="join-step__actions">
        <Button variant="ghost" onClick={prevStep} disabled={submitting}>← Back</Button>
        <Button variant="accent" size="lg" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Confirm & Join"}
        </Button>
      </div>
    </div>
  );
}

export default JoinConfirmation;