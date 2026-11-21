import "./HowItWorks.css";

const steps = [
  {
    number: "01",
    title: "Browse a campaign",
    description:
      "Browse campaigns published by verified organizations. Draft and paused campaigns are not shown publicly.",
  },
  {
    number: "02",
    title: "Record a donation intent",
    description:
      "Choose an amount to create a pending record. No payment is taken until a payment provider is configured.",
  },
  {
    number: "03",
    title: "Track campaign progress",
    description:
      "Campaign progress includes successful donation records and persisted public disbursement updates.",
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
