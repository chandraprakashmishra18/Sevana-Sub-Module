import "./HowItWorks.css";

const steps = [
  {
    number: "01",
    title: "Browse a verified need",
    description:
      "Choose from student sponsorships, family aid, or NGO in-kind requests — every listing is NGO-signed-off before it appears.",
  },
  {
    number: "02",
    title: "Donate securely",
    description:
      "Give any amount from ₹100 upward via UPI or card. Get an instant 80G tax-exemption receipt by email.",
  },
  {
    number: "03",
    title: "Track the real outcome",
    description:
      "Receive photo proof and a disbursement update once your donation is used — see the actual difference it made.",
  },
];

function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="container">
        <h2 className="how-it-works__title">How Sevana works</h2>

        <div className="how-it-works__grid">
          {steps.map((step, index) => (
            <div className="step-card" key={step.number}>
              <span className="step-card__number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {index < steps.length - 1 && (
                <span className="step-card__arrow">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;