import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import "./About.css";

function About() {
  return (
    <section className="about-page">
      <div className="container">
        <div className="about-page__hero">
          <span className="about-page__eyebrow">सेवाना — Devoted Service</span>
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
                In this demo, every campaign goes through an admin review step before
                it goes live. Real verification is planned for a full release.
              </p>
            </div>
            <div className="about-card">
              <h3>Traceable, not vague</h3>
              <p>
                Campaign progress is shown openly, with sample disbursement
                records to show how updates could look.
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
            real, present-day problem: <strong>donors often hesitate because
            they cannot see where their money goes.</strong>{" "}
            Sevana's planned trust layers — organization review,
            campaign approval, and visible progress — are our answer to that.
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