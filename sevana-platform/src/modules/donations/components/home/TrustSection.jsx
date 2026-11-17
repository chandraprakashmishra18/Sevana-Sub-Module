import "./TrustSection.css";

const trustLayers = [
  {
    icon: "01",
    title: "Organization Review",
    description:
      "In this demo, NGO details are submitted through a registration form and reviewed in an admin console. Real document verification is planned for a full release.",
  },
  {
    icon: "02",
    title: "Campaign Approval",
    description:
      "New campaigns start as drafts and only appear to donors after an admin approves them. Paused or rejected campaigns are hidden from the campaign list.",
  },
  {
    icon: "03",
    title: "Visible Progress",
    description:
      "Every campaign shows its goal, the amount raised and the number of donors, and updates when a demo donation is recorded.",
  },
  {
    icon: "04",
    title: "Sample Disbursement Updates",
    description:
      "Campaign pages show how fund-use updates could look. The records on this site are sample data, not real transactions.",
  },
];

function TrustSection() {
  return (
    <section className="trust-section">
      <div className="container">
        <div className="trust-section__header">
          <h2>How Sevana builds trust (demo)</h2>
          <p>
            Most platforms ask you to trust blindly. Sevana's approach is to
            make each step visible. This project demonstrates the idea with
            sample data.
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