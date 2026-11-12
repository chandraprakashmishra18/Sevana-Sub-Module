import "./NGOVerificationBadge.css";

function NGOVerificationBadge({ registrationNumber }) {
  return (
    <div className="ngo-verification-badge">
      <span className="ngo-verification-badge__icon">🛡️</span>
      <div>
        <p className="ngo-verification-badge__title">Verified & DigiLocker Checked</p>
        <p className="ngo-verification-badge__reg">Reg. No: {registrationNumber}</p>
      </div>
    </div>
  );
}

export default NGOVerificationBadge;