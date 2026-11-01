import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getInvitationsByUser,
  updateInvitationStatus,
} from "../services/invitationService";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import "./InvitationsPage.css";
import { getCommunityActivity } from "../services/communityService";

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
          <span>✅ Invitation accepted. Your Community Service XP has been recorded for this response.</span>
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
  const [activeTab, setActiveTab] = useState("received");
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [xpNotice, setXpNotice] = useState(null);
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("sevana_demo_user_email") || "volunteer@example.com");
  const [communityXP, setCommunityXP] = useState(() => getCommunityActivity(userEmail).totalXP);

  useEffect(() => {
    let isMounted = true;
    getInvitationsByUser("currentUser", userEmail).then(({ received: r, sent: s }) => {
      if (isMounted) {
        setReceived(r);
        setSent(s);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [userEmail]);

  const handleIdentityChange = (value) => {
    setUserEmail(value);
    localStorage.setItem("sevana_demo_user_email", value);
    setCommunityXP(getCommunityActivity(value).totalXP);
  };

  const handleAccept = async (invitation) => {
    await updateInvitationStatus(invitation.id, "accepted");
    setCommunityXP(getCommunityActivity(userEmail).totalXP);
    setReceived((prev) =>
      prev.map((inv) => (inv.id === invitation.id ? { ...inv, status: "accepted" } : inv))
    );
    const xp = invitation.xpReward || 150;
    setXpNotice(
      `🎉 Invitation accepted for "${invitation.campTitle}"! +${xp} Community Service XP recorded.`
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
              <label className="invitations-page__identity" htmlFor="invitations-email">
                Demo inbox email
                <input id="invitations-email" type="email" value={userEmail} onChange={(event) => handleIdentityChange(event.target.value)} />
              </label>
              <p className="invitations-page__xp-total">Your recorded community XP: <strong>{communityXP}</strong></p>
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
              <p>You haven't received any invitations yet.</p>
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
