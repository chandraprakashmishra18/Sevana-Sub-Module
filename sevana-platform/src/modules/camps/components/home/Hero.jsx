import { Link } from "react-router-dom";
import Button from "../common/Button";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="hero__eyebrow">सेवना — Devoted Community Service</span>
          <h1 className="hero__title">
            Medical care. <span>Real education.</span> For NGOs, Orphanages &amp; Seniors.
          </h1>
          <p className="hero__subtitle">
            Browse published medical and educational camps, register as a volunteer or beneficiary, or create a camp draft for your organization.
          </p>

          <div className="hero__actions">
            <Link to="/camps">
              <Button variant="accent" size="lg">Explore Camps</Button>
            </Link>
            <Link to="/organize">
              <Button variant="outline" size="lg">Organize a Camp</Button>
            </Link>
          </div>

          <div className="hero__trustrow">
            <span>✔ Medical &amp; Educational Camps</span>
            <span>✔ Orphanages &amp; Old Age Homes</span>
            <span>✔ Organization-managed camp drafts</span>
          </div>
        </div>

        <div className="hero__image">
          <img
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop"
            alt="Volunteers and medical professionals organizing a community service camp"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
