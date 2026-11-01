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
  const [alreadyJoined, setAlreadyJoined] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const result = await submitJoinCamp(joinData);
    if (result.success) {
      setAlreadyJoined(Boolean(result.duplicate));
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  if (submitted) {
    const isWorker = joinData.role === "worker";
    const xpReward = isWorker ? 150 : 30;

    return (
      <div className="join-confirmation join-confirmation--success">
        <div className="join-confirmation__icon">🎉</div>
        <h2>You're in, {joinData.fullName.split(" ")[0]}!</h2>
        
        <div className="join-confirmation__xp-badge">
          🌟 <strong>{alreadyJoined ? "Already registered" : `+${xpReward} Community XP`}</strong> {alreadyJoined ? "for this email and camp." : "awarded for registering to serve"}!
        </div>

        <p>
          You've successfully joined <strong>{camp.title}</strong> as{" "}
          {isWorker ? "a volunteer worker" : "an attendee"}. A confirmation
          has been sent to {joinData.email}.
        </p>

        <p className="join-confirmation__xp-note">
          {alreadyJoined
            ? "This email already has a registration for this camp."
            : "Your XP is saved in this browser and recorded once for this camp registration."}
        </p>

        <div className="join-confirmation__actions">
          <Link to="/leaderboard"><Button variant="outline">View Leaderboard</Button></Link>
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
              <span>XP Reward</span>
              <strong style={{ color: "#d97706" }}>+150 XP upon completion</strong>
            </div>
          </>
        ) : (
          <>
            <div className="join-confirmation__row">
              <span>Age Group</span>
              <strong>{joinData.ageGroup}</strong>
            </div>
            <div className="join-confirmation__row">
              <span>XP Reward</span>
              <strong style={{ color: "#d97706" }}>+30 XP for participation</strong>
            </div>
          </>
        )}
      </div>

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
