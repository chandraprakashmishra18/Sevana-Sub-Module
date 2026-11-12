import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import "./About.css";

function About() {
  return (
    <section className="about-page">
      <div className="container">
        <div className="about-page__hero">
          <span className="about-page__eyebrow">सेवना — Devoted Service</span>
          <h1>For the ones who cannot ask.</h1>
          <p>
            Sevana's Donations & Aid module exists because millions of people
            want to help — with a student's school fees, a family's ration, or
            an NGO's rescue drive — but have no fast, trustworthy channel to do
            it. We remove that friction.
          </p>
        </div>

        <div className="about-page__section">
          <h2>What we do differently</h2>
          <div className="about-page__grid">
            <div className="about-card">
              <h3>Verified, not anonymous</h3>
              <p>
                Every beneficiary and NGO passes identity verification before
                a campaign goes live. No unverifiable sob stories.
              </p>
            </div>
            <div className="about-card">
              <h3>Traceable, not vague</h3>
              <p>
                Every rupee is tracked to an actual disbursement — with
                geotagged, timestamped photo proof — not a generic "thank you."
              </p>
            </div>
            <div className="about-card">
              <h3>Hyperlocal, not distant</h3>
              <p>
                We focus on local NGOs and neighbourhood-level needs, so
                donors can see impact close to home.
              </p>
            </div>
          </div>
        </div>

        <div className="about-page__section">
          <h2>Why this exists</h2>
          <p className="about-page__text">
            This platform is part of the Sevana Civic & Compassion Super-App
            proposal — specifically its Donations & Aid module — built as a
            community-service technical project. It's designed to solve a
            real, present-day problem: <strong>67% of urban potential donors
            cite lack of trust as their primary barrier to giving.</strong>{" "}
            Sevana's multi-layer trust architecture — DigiLocker ID checks,
            NGO sign-off, and full disbursement trails — is our answer to that.
          </p>
        </div>

        <div className="about-page__cta">
          <h2>Ready to make a verified difference?</h2>
          <Link to="/campaigns">
            <Button variant="accent" size="lg">Browse Campaigns</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default About;