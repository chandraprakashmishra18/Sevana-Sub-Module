import { Link } from "react-router-dom";
import "./Dashboard.css";
import "./Workflow.css";

export default function AdminConsole() {
  return <section className="workspace-dashboard"><div className="container"><div className="workspace-dashboard__top"><div><span className="workspace-dashboard__eyebrow">ADMINISTRATION</span><h1>Moderation API is ready</h1><p>The current application does not include a moderation user interface.</p></div><Link className="workspace-dashboard__link" to="/dashboard">← Dashboard</Link></div><div className="workspace-dashboard__notice" role="status">Organization verification, campaign moderation, and contact-message review require a database-authorized ADMIN account and are available through the protected backend API. Publishing restrictions remain enforced by the server.</div></div></section>;
}
