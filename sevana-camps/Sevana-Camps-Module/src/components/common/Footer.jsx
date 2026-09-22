import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <h3>Sevana <span>— Camps</span></h3>
          <p>Medical and educational camps, organized transparently — join as a worker, attendee, or organizer.</p>
        </div>

        <div className="footer__col">
          <h4>Explore</h4>
          <Link to="/camps">Browse Camps</Link>
          <Link to="/organizers">Organizers</Link>
          <Link to="/past-camps">Past Camps</Link>
          <Link to="/leaderboard">Leaderboard</Link>
        </div>

        <div className="footer__col">
          <h4>Get Involved</h4>
          <Link to="/organize">Organize a Camp</Link>
          <Link to="/about">About Sevana</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div className="footer__col">
          <h4>Trust</h4>
          <p className="footer__note">NSS, NCC, schools & colleges onboarded.</p>
          <p className="footer__note">Real-time feedback on every camp.</p>
        </div>
      </div>

      <div className="footer__bottom container">
        <p>© {new Date().getFullYear()} Sevana. Built for community service (CS002).</p>
      </div>
    </footer>
  );
}

export default Footer;