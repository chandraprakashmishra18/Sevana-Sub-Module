import { useState } from "react";
import { sendInvitation } from "../../services/invitationService";
import "./InvitePanel.css";

const ROLES = [
  { value: "organizer", label: "Organizer Co-Lead" },
  { value: "worker", label: "Worker / Volunteer" },
  { value: "attendee", label: "Attendee" },
];

function InvitePanel({ campId, campTitle }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("worker");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const isValid = email.trim().length > 0 && email.includes("@");

  const handleSend = async () => {
    if (!isValid) return;
    setSending(true);
    await sendInvitation({ campId, campTitle, toEmail: email.trim(), role, message });
    setSending(false);
    setSuccess(true);
    setEmail("");
    setMessage("");
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="invite-panel">
      <p className="invite-panel__heading">
        <span className="invite-panel__heading-icon">✉️</span>
        Invite a Volunteer
      </p>

      <div className="invite-panel__field">
        <label htmlFor="invite-email">Email Address *</label>
        <input
          id="invite-email"
          type="email"
          placeholder="friend@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="invite-panel__field">
        <label htmlFor="invite-role">Role</label>
        <select
          id="invite-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div className="invite-panel__field">
        <label htmlFor="invite-message">Personal Message (optional)</label>
        <textarea
          id="invite-message"
          placeholder="Add a personal note to your invitation..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
      </div>

      <button
        className="invite-panel__send-btn"
        disabled={!isValid || sending}
        onClick={handleSend}
      >
        {sending ? "Sending..." : "Send Invite"}
      </button>

      {success && (
        <div className="invite-panel__success">
          ✅ Invitation sent successfully!
        </div>
      )}

      <p className="invite-panel__note">
        They'll receive an invitation to join this camp.
      </p>
    </div>
  );
}

export default InvitePanel;
