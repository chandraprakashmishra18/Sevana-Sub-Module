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
        <h2>Camp Submitted!</h2>
        <p>
          <strong>{formData.title}</strong> has been submitted for review.
          Once approved, it will appear in the Camps listing for workers and attendees to join.
        </p>
        <div className="organizer-review__actions">
          <Link to="/camps"><Button variant="outline">Browse Camps</Button></Link>
          <Link to="/"><Button variant="primary">Back to Home</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="organize-step">
      <h2>Step 3 of 3 — Review & Submit</h2>

      <div className="organizer-review__box">
        <div className="organizer-review__row">
          <span>Title</span>
          <strong>{formData.title}</strong>
        </div>
        <div className="organizer-review__row">
          <span>Type</span>
          <strong>{formData.type}</strong>
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
          <strong>{formData.workerRolesNeeded || "Not specified"}</strong>
        </div>
        <div className="organizer-review__row">
          <span>Media Attached</span>
          <strong>{formData.media.length} file(s)</strong>
        </div>
      </div>

      <p className="organizer-review__description">{formData.description}</p>

      <div className="organize-step__actions">
        <Button variant="ghost" onClick={onBack} disabled={submitting}>← Back</Button>
        <Button variant="accent" size="lg" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Camp"}
        </Button>
      </div>
    </div>
  );
}

export default OrganizerReview;