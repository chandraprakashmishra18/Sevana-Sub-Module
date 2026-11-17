import "./NGOVerificationBadge.css";

function NGOVerificationBadge({ registrationNumber }) {
  return (
    <div className="ngo-verification-badge">
      
      <div>
        <p className="ngo-verification-badge__title">Sample NGO record · demo data</p>
        <p className="ngo-verification-badge__reg">Reg. No: {registrationNumber}</p>
      </div>
    </div>
  );
}

export default NGOVerificationBadge;