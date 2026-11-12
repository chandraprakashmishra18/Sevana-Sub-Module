import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  getInvitationsByUser,
  updateInvitationStatus,
} from "../services/invitationService";
import Button from "../components/common/Button";
import "./InvitationsPage.css";

const STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
};

const BENEFICIARY_ICONS = {
  Orphanage: "🏠 Orphanage",
  "Old Age Home": "👴 Old Age Home",
  NGO: "🤝 NGO",
  General: "🌍 General Community",
};

function ReceivedCard({ invitation, onAccept, onDecline }) {
  const statusClass = `invitation-card__status-badge invitation-card__status-badge--${invitation.status}`;

  return (
    <div className="invitation-card">
      <div className="invitation-card__top">
        <div>
          <div className="invitation-card__header-line">
            <p className="invitation-card__camp">{invitation.campTitle}</p>
            {invitation.targetBeneficiary && (
              <span className="invitation-card__beneficiary-badge">
                {BENEFICIARY_ICONS[invitation.targetBeneficiary] || invitation.targetBeneficiary}
              </span>
            )}
          </div>
          <div className="invitation-card__meta">
            <span>From: <strong>{invitation.fromName}</strong></span>
            <span className="invitation-card__role-badge">{invitation.role}</span>
            <span className="invitation-card__xp-badge">
              🌟 +{invitation.xpReward || 150} XP
            </span>
            <span className="invitation-card__date">📅 {invitation.createdAt}</span>
          </div>
        </div>
        {invitation.status !== "pending" && (
          <span className={statusClass}>{STATUS_LABELS[invitation.status]}</span>
        )}
      </div>

      {invitation.message && (
        <p className="invitation-card__message">"{invitation.message}"</p>
      )}

      {invitation.status === "pending" ? (
        <div className="invitation-card__actions">
          <button
            className="invitation-card__btn invitation-card__btn--accept"
            onClick={() => onAccept(invitation)}
          >
            ✓ Accept Invitation (+{invitation.xpReward || 150} XP)
          </button>
          <button
            className="invitation-card__btn invitation-card__btn--decline"
            onClick={() => onDecline(invitation.id)}
          >
            ✕ Decline
          </button>
          {invitation.campId && (
            <Link to={`/camps/${invitation.campId}`} className="invitation-card__view-link">
              View Camp Details →
            </Link>
          )}
        </div>
      ) : invitation.status === "accepted" ? (
        <div className="invitation-card__accepted-info">
          <span>✅ Invitation accepted. Your Community Service XP has been recorded.</span>
          {invitation.campId && (
            <Link to={`/camps/${invitation.campId}`}>
              <Button variant="outline" size="sm">Go to Camp</Button>
            </Link>
          )}
        </div>
      ) : null}
    </div>
  );
}

function SentCard({ invitation }) {
  const statusClass = `invitation-card__status-badge invitation-card__status-badge--${invitation.status}`;

  return (
    <div className="invitation-card">
      <div className="invitation-card__top">
        <div>
          <div className="invitation-card__header-line">
            <p className="invitation-card__camp">{invitation.campTitle}</p>
            {invitation.targetBeneficiary && (
              <span className="invitation-card__beneficiary-badge">
                {BENEFICIARY_ICONS[invitation.targetBeneficiary] || invitation.targetBeneficiary}
              </span>
            )}
          </div>
          <div className="invitation-card__meta">
            <span>Sent to: <strong>{invitation.toEmail}</strong></span>
            <span className="invitation-card__role-badge">{invitation.role}</span>
            <span className="invitation-card__xp-badge">
              🌟 +{invitation.xpReward || 150} XP reward
            </span>
            <span className="invitation-card__date">📅 {invitation.createdAt}</span>
          </div>
        </div>
        <span className={statusClass}>{STATUS_LABELS[invitation.status]}</span>
      </div>

      {invitation.message && (
        <p className="invitation-card__message">"{invitation.message}"</p>
      )}

      {invitation.campId && (
        <div className="invitation-card__actions">
          <Link to={`/camps/${invitation.campId}`} className="invitation-card__view-link">
            View Camp Page →
          </Link>
        </div>
      )}
    </div>
  );
}

function InvitationsPage() {
  const { user, addXP } = useAuth();
  const [activeTab, setActiveTab] = useState("received");
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [xpNotice, setXpNotice] = useState(null);

  // Email to check invitations for
  const currentEmail = user ? user.email : "volunteer@example.com";

  useEffect(() => {
    let isMounted = true;
    getInvitationsByUser(user ? user.id : "currentUser", currentEmail).then(({ received: r, sent: s }) => {
      if (isMounted) {
        setReceived(r);
        setSent(s);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [user, currentEmail]);

  const handleAccept = async (invitation) => {
    await updateInvitationStatus(invitation.id, "accepted");
    const xp = invitation.xpReward || 150;
    if (addXP) {
      addXP(xp, `Accepted invitation for ${invitation.campTitle}`);
    }
    setReceived((prev) =>
      prev.map((inv) => (inv.id === invitation.id ? { ...inv, status: "accepted" } : inv))
    );
    setXpNotice(
      `🎉 Invitation accepted for "${invitation.campTitle}"! +${xp} Community Service XP has been added to your profile.`
    );
    setTimeout(() => setXpNotice(null), 6000);
  };

  const handleDecline = async (id) => {
    await updateInvitationStatus(id, "declined");
    setReceived((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "declined" } : inv))
    );
  };

  const pendingCount = received.filter((i) => i.status === "pending").length;

  return (
    <section className="invitations-page">
      <div className="container">
        <div className="invitations-page__header">
          <div className="invitations-page__title-wrap">
            <div>
              <h1>Camp Invitations &amp; Community Service</h1>
              <p>
                Collaborate with others to arrange and organize medical and educational camps for NGOs, Orphanages, and Old Age Homes. Earn XP points for every community contribution!
              </p>
              {user ? (
                <div style={{ marginTop: "8px", fontSize: "13.5px", color: "var(--color-primary-dark)", fontWeight: "600" }}>
                  👤 Viewing inbox for <strong>{user.name}</strong> ({user.email}) &bull; Current XP: <strong>{user.totalXP || 0} XP</strong>
                </div>
              ) : (
                <div style={{ marginTop: "8px", fontSize: "13px", color: "var(--color-text-muted)" }}>
                  💡 <Link to="/login" style={{ color: "var(--color-primary)", fontWeight: "600" }}>Log in</Link> or <Link to="/register" style={{ color: "var(--color-primary)", fontWeight: "600" }}>register</Link> to receive camp invitations at your personal email address.
                </div>
              )}
            </div>
            <div className="invitations-page__header-actions">
              <Link to="/camps">
                <Button variant="outline" size="sm">Browse Camps to Invite</Button>
              </Link>
              <Link to="/organize">
                <Button variant="accent" size="sm">+ Organize New Camp</Button>
              </Link>
            </div>
          </div>
        </div>

        {xpNotice && (
          <div className="invitations-page__xp-alert">
            {xpNotice}
          </div>
        )}

        <div className="invitations-page__tabs">
          <button
            className={`invitations-page__tab ${activeTab === "received" ? "invitations-page__tab--active" : ""}`}
            onClick={() => setActiveTab("received")}
          >
            🔔 Received Invitations
            {pendingCount > 0 && (
              <span className="invitations-page__tab-count">{pendingCount} pending</span>
            )}
          </button>
          <button
            className={`invitations-page__tab ${activeTab === "sent" ? "invitations-page__tab--active" : ""}`}
            onClick={() => setActiveTab("sent")}
          >
            📤 Sent Invitations ({sent.length})
          </button>
        </div>

        {loading ? (
          <p className="invitations-page__loading">Loading invitations...</p>
        ) : activeTab === "received" ? (
          received.length === 0 ? (
            <div className="invitations-page__empty">
              <div className="invitations-page__empty-icon">📭</div>
              <p>No invitations received for {currentEmail}.</p>
              <Link to="/camps">
                <Button variant="primary" size="sm">Explore Camps</Button>
              </Link>
            </div>
          ) : (
            received.map((inv) => (
              <ReceivedCard
                key={inv.id}
                invitation={inv}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            ))
          )
        ) : (
          sent.length === 0 ? (
            <div className="invitations-page__empty">
              <div className="invitations-page__empty-icon">📤</div>
              <p>You haven't sent any invitations yet. Go to any camp page and use the "Invite a Volunteer" panel to invite friends and specialists!</p>
              <Link to="/camps">
                <Button variant="primary" size="sm">Find a Camp to Invite For</Button>
              </Link>
            </div>
          ) : (
            sent.map((inv) => (
              <SentCard key={inv.id} invitation={inv} />
            ))
          )
        )}
      </div>
    </section>
  );
}

export default InvitationsPage;
