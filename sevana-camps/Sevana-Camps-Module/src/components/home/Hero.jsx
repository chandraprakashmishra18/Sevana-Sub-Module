import { Link } from "react-router-dom";
import Button from "../common/Button";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="hero__eyebrow">सेवना — Devoted Service</span>
          <h1 className="hero__title">
            Medical care. <span>Real education.</span> Real people, showing up.
          </h1>
          <p className="hero__subtitle">
            Join a camp as a doctor, teacher, or volunteer — or attend one for
            a checkup or a class. Every camp is organized by a verified NGO,
            school, or NSS/NCC unit, with real-time feedback and full impact tracking.
          </p>

          <div className="hero__actions">
            <Link to="/camps">
              <Button variant="accent" size="lg">Browse Camps</Button>
            </Link>
            <Link to="/organize">
              <Button variant="outline" size="lg">Organize a Camp</Button>
            </Link>
          </div>

          <div className="hero__trustrow">
            <span>✔ NSS/NCC Onboarded</span>
            <span>✔ Verified Organizers</span>
            <span>✔ Earn XP While Helping</span>
          </div>
        </div>

        <div className="hero__image">
          <img
            src="https://picsum.photos/seed/camps-hero/700/500"
            alt="Volunteers and doctors at a community medical camp"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;