import "./VerificationSteps.css";

const steps = [
  { label: "Organization status", detail: "Verification state is stored on the organization record." },
  { label: "Campaign publication", detail: "Verified organization managers may publish campaigns." },
  { label: "Donation intents", detail: "New donation requests stay pending until payment settlement exists." },
  { label: "Disbursement records", detail: "Published aid distribution records are retrieved from the backend." },
];

function VerificationSteps() {
  return (
    <div className="verification-steps">
      {steps.map((step, index) => (
        <div className="verification-step" key={step.label}>
          <div className="verification-step__marker">
            <span>{index + 1}</span>
          </div>
          <div>
            <p className="verification-step__label">{step.label}</p>
            <p className="verification-step__detail">{step.detail}</p>
          </div>
          {index < steps.length - 1 && <div className="verification-step__line" />}
        </div>
      ))}
    </div>
  );
}

export default VerificationSteps;
