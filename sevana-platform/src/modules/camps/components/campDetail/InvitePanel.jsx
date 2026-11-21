import { useState } from "react";
import { sendInvitation } from "../../services/invitationService";
import "./InvitePanel.css";
const ROLES = [["worker", "Volunteer / Field Worker"], ["organizer", "Co-organizer"], ["medical", "Medical Specialist"], ["teacher", "Teacher"], ["attendee", "Attendee"]];

export default function InvitePanel({ campId }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("worker");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const send = async (event) => {
    event.preventDefault(); setSending(true); setError(""); setNotice("");
    try { await sendInvitation({ campId, toEmail: email, role, message }); setNotice("Invitation saved. A notification was sent if the recipient has a Sevana account."); setEmail(""); setMessage(""); }
    catch (requestError) { setError(requestError.message || "Unable to send invitation."); }
    finally { setSending(false); }
  };
  return <form className="invite-panel" onSubmit={send}><p className="invite-panel__heading">Invite a participant</p><p className="invite-panel__subtitle">Invitations are persisted and can be accepted by the recipient’s Sevana account.</p><div className="invite-panel__field"><label htmlFor="invite-email">Email address</label><input id="invite-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div><div className="invite-panel__field"><label htmlFor="invite-role">Role</label><select id="invite-role" value={role} onChange={(e) => setRole(e.target.value)}>{ROLES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div><div className="invite-panel__field"><label htmlFor="invite-message">Message (optional)</label><textarea id="invite-message" rows="3" maxLength="2000" value={message} onChange={(e) => setMessage(e.target.value)} /></div>{error && <p role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}<button className="invite-panel__send-btn" disabled={sending}>{sending ? "Sending…" : "Send invitation"}</button></form>;
}
