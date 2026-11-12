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
          <Link to="/camps" className="not-found-secondary-btn">
            🏕️ Explore All Camps
          </Link>
          <Link to="/organize" className="not-found-secondary-btn">
            ➕ Organize a Camp
          </Link>
        </div>

        <div className="not-found-crosslink">
          <p>Looking for Donations or Aid?</p>
          <a href="http://localhost:5173/" className="not-found-external-btn">
            💖 Open Donations & Aid Portal (Port 5173) ↗
          </a>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
