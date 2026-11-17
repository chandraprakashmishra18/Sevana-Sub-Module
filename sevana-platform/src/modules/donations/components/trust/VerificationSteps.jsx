import "./VerificationSteps.css";

const steps = [
  { label: "Details Reviewed", detail: "Organization details reviewed (demo)" },
  { label: "Admin Approved", detail: "Admin approves the campaign (simulated)" },
  { label: "Campaign Live", detail: "Published for donors, fully public" },
  { label: "Funds Disbursed", detail: "Sample update records shown" },
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