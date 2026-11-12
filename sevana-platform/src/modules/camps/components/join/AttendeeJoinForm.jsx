import { useJoinCamp } from "../../context/useJoinCamp";
import Button from "../common/Button";
import "./WorkerJoinForm.css";

function AttendeeJoinForm({ camp }) {
  const { joinData, updateJoinData, nextStep } = useJoinCamp();

  const isValid = joinData.reasonForVisit.trim() && joinData.ageGroup;

  return (
    <div className="join-step">
      <h2>Step 1 of 3 — Attendee Details</h2>
      <p className="join-step__intro">
        You're joining <strong>{camp.title}</strong> as an attendee.
      </p>

      <label className="join-step__field">
        <span>Age Group *</span>
        <select
          value={joinData.ageGroup}
          onChange={(e) => updateJoinData({ ageGroup: e.target.value })}
        >
          <option value="">Select age group</option>
          <option value="Under 18">Under 18</option>
          <option value="18–40">18–40</option>
          <option value="40–60">40–60</option>
          <option value="Above 60">Above 60</option>
        </select>
      </label>

      <label className="join-step__field">
        <span>
          {camp.type === "Medical" ? "Reason for Visit *" : "What do you hope to learn? *"}
        </span>
        <textarea
          rows="3"
          placeholder={
            camp.type === "Medical"
              ? "e.g. General checkup, eye test, vaccination"
              : "e.g. Basic English speaking, using smartphone apps"
          }
          value={joinData.reasonForVisit}
          onChange={(e) => updateJoinData({ reasonForVisit: e.target.value })}
        />
      </label>

      <Button variant="accent" size="lg" fullWidth disabled={!isValid} onClick={nextStep}>
        Continue
      </Button>
    </div>
  );
}

export default AttendeeJoinForm;