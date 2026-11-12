import "./VerificationSteps.css";

const steps = [
  { label: "Identity Verified", detail: "DigiLocker ID check on beneficiary & NGO" },
  { label: "NGO Signed Off", detail: "Verified partner NGO approves the need" },
  { label: "Campaign Live", detail: "Published for donors, fully public" },
  { label: "Funds Disbursed", detail: "Photo & geotag proof uploaded" },
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