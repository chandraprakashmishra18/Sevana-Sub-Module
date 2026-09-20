import Button from "../common/Button";
import "./CampDetailsForm.css";

function CampDetailsForm({ formData, updateFormData, onNext }) {
  const isValid =
    formData.title.trim() &&
    formData.type &&
    formData.date &&
    formData.time.trim() &&
    formData.location.trim() &&
    formData.description.trim();

  return (
    <div className="organize-step">
      <h2>Step 1 of 3 — Camp Details</h2>

      <label className="organize-step__field">
        <span>Camp Title *</span>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          placeholder="e.g. Free Dental Checkup Camp"
        />
      </label>

      <label className="organize-step__field">
        <span>Camp Type *</span>
        <select value={formData.type} onChange={(e) => updateFormData({ type: e.target.value })}>
          <option value="">Select type</option>
          <option value="Medical">Medical</option>
          <option value="Educational">Educational</option>
        </select>
      </label>

      <div className="organize-step__row">
        <label className="organize-step__field">
          <span>Date *</span>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => updateFormData({ date: e.target.value })}
          />
        </label>

        <label className="organize-step__field">
          <span>Time *</span>
          <input
            type="text"
            value={formData.time}
            onChange={(e) => updateFormData({ time: e.target.value })}
            placeholder="e.g. 9:00 AM – 2:00 PM"
          />
        </label>
      </div>

      <label className="organize-step__field">
        <span>Location *</span>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => updateFormData({ location: e.target.value })}
          placeholder="Full address or venue name"
        />
      </label>

      <label className="organize-step__field">
        <span>Description *</span>
        <textarea
          rows="4"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="What is this camp about? Who is it for?"
        />
      </label>

      <label className="organize-step__field">
        <span>Worker Roles Needed (comma separated)</span>
        <input
          type="text"
          value={formData.workerRolesNeeded}
          onChange={(e) => updateFormData({ workerRolesNeeded: e.target.value })}
          placeholder="e.g. Doctor, Nurse, Volunteer"
        />
      </label>

      <Button variant="accent" size="lg" fullWidth disabled={!isValid} onClick={onNext}>
        Continue
      </Button>
    </div>
  );
}

export default CampDetailsForm;