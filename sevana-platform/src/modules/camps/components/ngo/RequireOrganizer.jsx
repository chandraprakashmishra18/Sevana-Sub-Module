import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import "../../pages/NgoDashboard.css";

// UX-only guard. Real authorization must be enforced by the backend.
export default function RequireOrganizer({ children }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <section className="ngo-page">
        <div className="container ngo-gate">
          <h1>Please log in</h1>
          <p>Log in with your organization account to manage camps.</p>
          <Link className="ngo-btn ngo-btn--primary" to="/login">Log in</Link>
        </div>
      </section>
    );
  }

  if (user.roleType !== "organizer") {
    return (
      <section className="ngo-page">
        <div className="container ngo-gate">
          <h1>Organizer access only</h1>
          <p>This area is for NGO / institution organizers. Register with the "NGO / Institution Organizer" role to manage camps.</p>
          <Link className="ngo-btn" to="/camps">Browse camps</Link>
        </div>
      </section>
    );
  }

  return children;
}
