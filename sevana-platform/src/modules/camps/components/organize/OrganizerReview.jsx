import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import { submitNewCamp } from "../../services/organizerService";
import "./OrganizerReview.css";

function OrganizerReview({ formData, organizationId, onBack }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const result = await submitNewCamp(formData, organizationId);
      if (result.success) setSubmitted(true);
    } catch (err) { setError(err.message || "Could not create this camp."); }
    finally { setSubmitting(false); }
  };

  if (submitted) {
    return (
      <div className="organizer-review organizer-review--success">
        <div className="organizer-review__icon">🎉</div>
        <h2>Camp draft created</h2>
        <p>
          <strong>{formData.title}</strong> was saved to your organization. It will appear in the public directory after an authorized manager publishes it.
        </p>
        <div className="organizer-review__actions">
          <Link to="/manage-camps"><Button variant="outline">Manage camps</Button></Link>
          <Link to="/camps"><Button variant="primary">Browse published camps</Button></Link>
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
          <strong>{formData.startTime} – {formData.endTime}</strong>
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
        </div>
        {formData.media && formData.media.length > 0 && (
          <div className="organizer-review__row">
            <span>Media Attached</span>
            <strong>{formData.media.length} file(s)</strong>
          </div>
        )}
      </div>

      <p className="organizer-review__description">{formData.description}</p>
      {error && <p role="alert">{error}</p>}

      <div className="organize-step__actions">
        <Button variant="ghost" onClick={onBack} disabled={submitting}>← Back</Button>
        <Button variant="accent" size="lg" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Creating draft…" : "Create camp draft"}
        </Button>
      </div>
    </div>
  );
}

export default OrganizerReview;
