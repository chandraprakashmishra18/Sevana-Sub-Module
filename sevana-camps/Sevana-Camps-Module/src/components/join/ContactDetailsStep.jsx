import { useJoinCamp } from "../../context/useJoinCamp";
import Button from "../common/Button";
import "./WorkerJoinForm.css";

function ContactDetailsStep() {
  const { joinData, updateJoinData, nextStep, prevStep } = useJoinCamp();

  const isValid =
    joinData.fullName.trim() && joinData.email.trim() && joinData.phone.trim();

  return (
    <div className="join-step">
      <h2>Step 2 of 3 — Your Details</h2>

      <label className="join-step__field">
        <span>Full Name *</span>
        <input
          type="text"
          value={joinData.fullName}
          onChange={(e) => updateJoinData({ fullName: e.target.value })}
          placeholder="Enter your full name"
        />
      </label>

      <label className="join-step__field">
        <span>Email *</span>
        <input
          type="email"
          value={joinData.email}
          onChange={(e) => updateJoinData({ email: e.target.value })}
          placeholder="you@example.com"
        />
      </label>

      <label className="join-step__field">
        <span>Phone Number *</span>
        <input
          type="tel"
          value={joinData.phone}
          onChange={(e) => updateJoinData({ phone: e.target.value })}
          placeholder="10-digit mobile number"
        />
      </label>

      <div className="join-step__actions">
        <Button variant="ghost" onClick={prevStep}>← Back</Button>
        <Button variant="accent" size="lg" disabled={!isValid} onClick={nextStep}>
          Review & Submit
        </Button>
      </div>
    </div>
  );
}

export default ContactDetailsStep;