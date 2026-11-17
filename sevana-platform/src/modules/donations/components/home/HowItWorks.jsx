import "./HowItWorks.css";

const steps = [
  {
    number: "01",
    title: "Browse a campaign",
    description:
      "Choose from student sponsorships, family aid, or NGO in-kind requests — new campaigns appear after admin approval in this demo.",
  },
  {
    number: "02",
    title: "Try the demo checkout",
    description:
      "Pick an amount and complete a demo checkout. You get an on-screen receipt; no real payment is made.",
  },
  {
    number: "03",
    title: "Track campaign progress",
    description:
      "Watch a campaign's raised amount and donor count grow, and see sample disbursement records.",
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