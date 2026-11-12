import "./HowItWorks.css";

const steps = [
  {
    number: "01",
    title: "Choose your role",
    description:
      "Browse a camp and decide how you want to help — join as a worker (doctor, teacher, volunteer) or attend as someone needing a checkup or class.",
  },
  {
    number: "02",
    title: "Register in minutes",
    description:
      "Fill in a short form based on your role — your skills and availability as a worker, or your needs as an attendee.",
  },
  {
    number: "03",
    title: "Show up and earn XP",
    description:
      "Attend the camp, help out or get helped, and leave real-time feedback. Workers earn XP, badges, and climb the leaderboard.",
  },
];

function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="container">
        <h2 className="how-it-works__title">How Sevana Camps works</h2>

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