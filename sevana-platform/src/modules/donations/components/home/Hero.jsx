import { Link } from "react-router-dom";
import Button from "../common/Button";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="hero__eyebrow">सेवाना — Devoted Service</span>
          <h1 className="hero__title">
            Local giving. <span>Clear progress.</span> Made simple.
          </h1>
          <p className="hero__subtitle">
            Browse local needs, pick a campaign, and see how your
            contribution moves a goal forward — sponsor a student,
            support a family, or back an NGO drive. (Demo project: no real payments.)
          </p>

          <div className="hero__actions">
            <Link to="/campaigns">
              <Button variant="accent" size="lg">Donate Now</Button>
            </Link>
            <Link to="/impact">
              <Button variant="outline" size="lg">See Our Impact</Button>
            </Link>
          </div>

          <div className="hero__trustrow">
            <span>Demo Project</span>
            <span>Sample NGO Partners</span>
            <span>Live Campaign Progress</span>
          </div>
        </div>

        <div className="hero__image">
          <img
            src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=700"
            alt="Volunteers distributing aid to a community"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;