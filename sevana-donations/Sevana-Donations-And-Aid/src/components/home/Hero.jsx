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
            Verified giving. <span>Real impact.</span> No middlemen.
          </h1>
          <p className="hero__subtitle">
            Every rupee you donate is tracked from your pocket to a
            geotagged, photo-verified disbursement — sponsor a student,
            support a family, or fund an NGO drive, and see exactly where it went.
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
            <span>✔ 80G Tax Receipts</span>
            <span>✔ NGO Verified</span>
            <span>✔ Full Disbursement Trail</span>
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