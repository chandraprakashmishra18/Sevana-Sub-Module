import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <h3>Sevana <span>— Donations & Aid</span></h3>
          <p>Devoted service. Verified giving, hyperlocal impact, full transparency.</p>
        </div>

        <div className="footer__col">
          <h4>Explore</h4>
          <Link to="/campaigns">Campaigns</Link>
          <Link to="/ngo-partners">NGO Partners</Link>
          <Link to="/impact">Impact & Transparency</Link>
        </div>

        <div className="footer__col">
          <h4>Organization</h4>
          <Link to="/about">About Sevana</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div className="footer__col">
          <h4>Trust</h4>
          <p className="footer__note">80G tax-exempt receipts on every donation.</p>
          <p className="footer__note">Every rupee tracked to disbursement.</p>
        </div>
      </div>

      <div className="footer__bottom container">
        <p>© {new Date().getFullYear()} Sevana. Built for community service (CS002).</p>
      </div>
    </footer>
  );
}

export default Footer;