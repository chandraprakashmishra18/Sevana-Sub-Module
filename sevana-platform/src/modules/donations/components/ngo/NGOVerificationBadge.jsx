import "./NGOVerificationBadge.css";

function NGOVerificationBadge({ verificationStatus }) {
  const verified = verificationStatus === "VERIFIED";
  return (
    <div className="ngo-verification-badge">
      <div>
        <p className="ngo-verification-badge__title">{verified ? "Verified organization" : "Verification pending"}</p>
        <p className="ngo-verification-badge__reg">Status supplied by Sevana</p>
      </div>
    </div>
  );
}

export default NGOVerificationBadge;
