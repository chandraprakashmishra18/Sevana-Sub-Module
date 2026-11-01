import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import { submitNewCamp } from "../../services/organizerService";
import "./OrganizerReview.css";

function OrganizerReview({ formData, onBack }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const result = await submitNewCamp(formData);
    if (result.success) {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="organizer-review organizer-review--success">
        <div className="organizer-review__icon">🎉</div>
        <h2>Camp Submitted Successfully!</h2>
        <div className="organizer-review__xp-award">
          🌟 <strong>+300 XP Earned!</strong> You've received organizer community karma.
        </div>
        <p>
          <strong>{formData.title}</strong> is now listed in the Camps directory as a community-submitted camp. NGO verification and moderator approval are not connected in this demo.
        </p>
        <div className="organizer-review__actions">
          <Link to="/camps"><Button variant="outline">Browse Camps</Button></Link>
          <Link to="/leaderboard"><Button variant="primary">View Leaderboard</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="organize-step">
      <h2>Step 3 of 3 — Review &amp; Submit</h2>

      <div className="organizer-review__box">
        <div className="organizer-review__row">
          <span>Title</span>
          <strong>{formData.title}</strong>
        </div>
        <div className="organizer-review__row">
          <span>Type</span>
          <strong>{formData.type} Camp</strong>
        </div>
        <div className="organizer-review__row">
          <span>Target Beneficiary</span>
          <strong>{formData.targetBeneficiary || "General Community"}</strong>
        </div>
        <div className="organizer-review__row">
          <span>Date</span>
          <strong>{formData.date}</strong>
        </div>
        <div className="organizer-review__row">
          <span>Time</span>
          <strong>{formData.time}</strong>
        </div>
        <div className="organizer-review__row">
          <span>Location</span>
          <strong>{formData.location}</strong>
        </div>
        <div className="organizer-review__row">
          <span>Roles Needed</span>
          <strong>{formData.workerRolesNeeded || "General Volunteers"}</strong>
        </div>
        <div className="organizer-review__row">
          <span>Community XP Reward</span>
          <strong style={{ color: "#d97706" }}>+300 XP for Organizer</strong>
        </div>
        {formData.media && formData.media.length > 0 && (
          <div className="organizer-review__row">
            <span>Media Attached</span>
            <strong>{formData.media.length} file(s)</strong>
          </div>
        )}
      </div>

      <p className="organizer-review__description">{formData.description}</p>

      <div className="organize-step__actions">
        <Button variant="ghost" onClick={onBack} disabled={submitting}>← Back</Button>
        <Button variant="accent" size="lg" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Camp (+300 XP)"}
        </Button>
      </div>
    </div>
  );
}

export default OrganizerReview;
