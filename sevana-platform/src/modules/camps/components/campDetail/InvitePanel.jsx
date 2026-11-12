import { useState } from "react";
import { sendInvitation } from "../../services/invitationService";
import "./InvitePanel.css";

const ROLES = [
  { value: "organizer", label: "Co-Organizer (Arranging & Logistics)" },
  { value: "medical", label: "Medical Specialist / Doctor" },
  { value: "teacher", label: "Teacher / Educational Lead" },
  { value: "worker", label: "Volunteer / Field Worker" },
  { value: "attendee", label: "Attendee / Participant" },
];

function InvitePanel({ campId, campTitle, targetBeneficiary }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("worker");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const isValid = email.trim().length > 0 && email.includes("@");

  const handleSend = async () => {
    if (!isValid) return;
    setSending(true);
    await sendInvitation({
      campId,
      campTitle,
      targetBeneficiary,
      toEmail: email.trim(),
      role,
      message,
    });
    setSending(false);
    setSuccess(true);
    setEmail("");
    setMessage("");
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="invite-panel">
      <p className="invite-panel__heading">
        <span className="invite-panel__heading-icon">✉️</span>
        Invite Others to Arrange &amp; Join
      </p>
      <p className="invite-panel__subtitle">
        Invite friends, doctors, teachers, or NGOs to co-organize or volunteer for this community camp.
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
        <label htmlFor="invite-role">Role in Camp</label>
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
          placeholder="Add a note (e.g. 'Hey, let's arrange the supplies together for the kids!')..."
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
        {sending ? "Sending..." : "Send Invitation"}
      </button>

      {success && (
        <div className="invite-panel__success">
          ✅ Invitation sent! You earn XP when others join and participate.
        </div>
      )}

      <p className="invite-panel__note">
        Invitations show in their profile with role details and XP milestones.
      </p>
    </div>
  );
}

export default InvitePanel;
