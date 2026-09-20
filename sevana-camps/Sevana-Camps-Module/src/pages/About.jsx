import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import "./About.css";

function About() {
  return (
    <section className="about-page">
      <div className="container">
        <div className="about-page__hero">
          <span className="about-page__eyebrow">सेवना — Devoted Service</span>
          <h1>Care and learning, organized transparently.</h1>
          <p>
            Sevana's Camps module connects doctors, teachers, and volunteers
            with people who need a checkup or a class — organized by verified
            NGOs, schools, and NSS/NCC units, with real outcomes tracked openly.
          </p>
        </div>

        <div className="about-page__section">
          <h2>What we do differently</h2>
          <div className="about-page__grid">
            <div className="about-card">
              <h3>Role-based, not one-size-fits-all</h3>
              <p>
                Whether you're a doctor volunteering your time or a student
                needing a checkup, the platform adapts to what you actually need.
              </p>
            </div>
            <div className="about-card">
              <h3>Rewarded, not thankless</h3>
              <p>
                Workers earn XP, badges, and tier progression for every camp
                they contribute to — real recognition for real effort.
              </p>
            </div>
            <div className="about-card">
              <h3>Verified, not anonymous</h3>
              <p>
                Every camp is organized by an onboarded NGO, school, or
                NSS/NCC unit — no unverifiable listings.
              </p>
            </div>
          </div>
        </div>

        <div className="about-page__section">
          <h2>Why this exists</h2>
          <p className="about-page__text">
            This platform is part of the Sevana Civic & Compassion Super-App
            proposal — specifically its Camps module — built as a community-service
            technical project. It's designed to solve a real, present-day problem:{" "}
            <strong>India ranks 145th of 180 countries in healthcare access</strong>,
            and countless students lack awareness of career and scholarship
            opportunities. Sevana's Camps module brings organized, trackable,
            trust-verified events directly to communities that need them.
          </p>
        </div>

        <div className="about-page__cta">
          <h2>Ready to make a difference?</h2>
          <Link to="/camps">
            <Button variant="accent" size="lg">Browse Camps</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default About;