import "./TrustSection.css";

const trustLayers = [
  {
    icon: "🪪",
    title: "Identity Verification",
    description:
      "Every beneficiary and NGO on Sevana is verified through DigiLocker ID checks before a campaign goes live — no anonymous requests.",
  },
  {
    icon: "✅",
    title: "NGO Sign-Off",
    description:
      "A partnered, verified NGO reviews and signs off on every campaign before it's published, confirming the need is genuine.",
  },
  {
    icon: "📸",
    title: "Impact Photo Proof",
    description:
      "Once funds are used, geotagged and timestamped photos of the actual purchase or aid delivery are uploaded — visible to every donor.",
  },
  {
    icon: "🧾",
    title: "Full Disbursement Trail",
    description:
      "Track exactly how your donation was split and spent, down to the rupee, with a public timeline from payment to delivery.",
  },
];

function TrustSection() {
  return (
    <section className="trust-section">
      <div className="container">
        <div className="trust-section__header">
          <h2>Why donors trust Sevana</h2>
          <p>
            Most platforms ask you to trust blindly. Sevana replaces that
            with a tamper-proof, verifiable trail — from your payment to the
            beneficiary's hands.
          </p>
        </div>

        <div className="trust-section__grid">
          {trustLayers.map((layer) => (
            <div className="trust-card" key={layer.title}>
              <span className="trust-card__icon">{layer.icon}</span>
              <h3>{layer.title}</h3>
              <p>{layer.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustSection;