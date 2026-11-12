import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./CrossModuleBridge.css";

function CrossModuleBridge({ targetPort = 5173, targetTitle = "Sevana Donations & Aid" }) {
  const location = useLocation();
  const [countdown, setCountdown] = useState(3);
  const targetUrl = `http://localhost:${targetPort}${location.pathname}${location.search}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = targetUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetUrl]);

  return (
    <div className="container bridge-container">
      <div className="bridge-card">
        <div className="bridge-icon">💖</div>
        <h2>Moving to {targetTitle}</h2>
        <p className="bridge-text">
          The requested page (<code>{location.pathname}</code>) belongs to the{" "}
          <strong>Donations & Aid</strong> module.
        </p>
        <p className="bridge-timer">
          Redirecting automatically in <strong>{countdown}</strong> seconds...
        </p>

        <div className="bridge-actions">
          <a href={targetUrl} className="bridge-primary-btn">
            👉 Continue to Donations (Port {targetPort})
          </a>
          <Link to="/" className="bridge-secondary-btn">
            Stay on Camps Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CrossModuleBridge;

