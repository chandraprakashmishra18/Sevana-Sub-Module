import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="container not-found-container">
      <div className="not-found-card">
        <span className="not-found-badge">404 Error</span>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-subtitle">
          We couldn't find the page you're looking for. It might have been moved or you may have entered an incorrect URL.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="not-found-primary-btn">
            🏠 Return to Home
          </Link>
          <Link to="/campaigns" className="not-found-secondary-btn">
            💖 Browse Campaigns
          </Link>
          <Link to="/donate" className="not-found-secondary-btn">
            🤝 Donate Now
          </Link>
        </div>

        <div className="not-found-crosslink">
          <p>Looking for Medical or Educational Camps?</p>
          <Link to="/camps" className="not-found-external-btn">
            🏕️ Browse Educational & Medical Camps
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
