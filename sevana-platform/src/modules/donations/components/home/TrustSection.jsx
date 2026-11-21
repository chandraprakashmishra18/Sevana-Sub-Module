import "./TrustSection.css";

const trustLayers = [
  {
    icon: "01",
    title: "Organization Review",
    description:
      "Organization profiles and verification status come from backend records. Admin verification controls are not available in this application.",
  },
  {
    icon: "02",
    title: "Campaign Approval",
    description:
      "Campaigns start as drafts. Only managers of verified organizations can publish them; campaign moderation tools are not exposed.",
  },
  {
    icon: "03",
    title: "Visible Progress",
    description:
      "Campaign totals include successful backend donation records. Pending intents do not increase the totals.",
  },
  {
    icon: "04",
    title: "Published Disbursement Updates",
    description:
      "Campaign pages show persisted aid distribution records when the backend has them.",
  },
];

function TrustSection() {
  return (
    <section className="trust-section">
      <div className="container">
        <div className="trust-section__header">
          <h2>How Sevana builds trust</h2>
          <p>
            Most platforms ask you to trust blindly. Sevana's approach is to
            make each step visible. Payment settlement and organization moderation still require external operational setup.
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
