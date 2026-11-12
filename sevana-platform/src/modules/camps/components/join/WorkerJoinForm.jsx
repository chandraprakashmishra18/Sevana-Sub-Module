import { useJoinCamp } from "../../context/useJoinCamp";
import Button from "../common/Button";
import "./WorkerJoinForm.css";

function WorkerJoinForm({ camp }) {
  const { joinData, updateJoinData, nextStep } = useJoinCamp();

  const isValid = joinData.skillOrProfession.trim() && joinData.availability.trim();

  return (
    <div className="join-step">
      <h2>Step 1 of 3 — Worker Details</h2>
      <p className="join-step__intro">
        You're joining <strong>{camp.title}</strong> as a worker.
      </p>

      <label className="join-step__field">
        <span>Your Skill / Profession *</span>
        <select
          value={joinData.skillOrProfession}
          onChange={(e) => updateJoinData({ skillOrProfession: e.target.value })}
        >
          <option value="">Select a role</option>
          {camp.workerRolesNeeded.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </label>

      <label className="join-step__field">
        <span>Availability *</span>
        <select
          value={joinData.availability}
          onChange={(e) => updateJoinData({ availability: e.target.value })}
        >
          <option value="">Select availability</option>
          <option value="Full day">Full day</option>
          <option value="Morning only">Morning only</option>
          <option value="Afternoon only">Afternoon only</option>
        </select>
      </label>

      <label className="join-step__field">
        <span>Relevant Experience (optional)</span>
        <textarea
          rows="3"
          placeholder="e.g. 2 years as a volunteer nurse, or NCC certified"
          value={joinData.experience}
          onChange={(e) => updateJoinData({ experience: e.target.value })}
        />
      </label>

      <Button variant="accent" size="lg" fullWidth disabled={!isValid} onClick={nextStep}>
        Continue
      </Button>
    </div>
  );
}

export default WorkerJoinForm;