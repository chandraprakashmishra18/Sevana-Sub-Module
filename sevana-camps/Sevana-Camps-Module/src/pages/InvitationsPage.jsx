import { useState, useEffect } from "react";
import {
  getInvitationsByUser,
  updateInvitationStatus,
} from "../services/invitationService";
import "./InvitationsPage.css";

const STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
};

function ReceivedCard({ invitation, onAccept, onDecline }) {
  const statusClass = `invitation-card__status-badge invitation-card__status-badge--${invitation.status}`;

  return (
    <div className="invitation-card">
      <div className="invitation-card__top">
        <div>
          <p className="invitation-card__camp">{invitation.campTitle}</p>
          <div className="invitation-card__meta">
            <span>From: <strong>{invitation.fromName}</strong></span>
            <span className="invitation-card__role-badge">{invitation.role}</span>
            <span className="invitation-card__date">{invitation.createdAt}</span>
          </div>
        </div>
        {invitation.status !== "pending" && (
          <span className={statusClass}>{STATUS_LABELS[invitation.status]}</span>
        )}
      </div>

      {invitation.message && (
        <p className="invitation-card__message">"{invitation.message}"</p>
      )}

      {invitation.status === "pending" && (
        <div className="invitation-card__actions">
          <button
            className="invitation-card__btn invitation-card__btn--accept"
            onClick={() => onAccept(invitation.id)}
          >
            ✓ Accept
          </button>
          <button
            className="invitation-card__btn invitation-card__btn--decline"
            onClick={() => onDecline(invitation.id)}
          >
            ✕ Decline
          </button>
        </div>
      )}
    </div>
  );
}

function SentCard({ invitation }) {
  const statusClass = `invitation-card__status-badge invitation-card__status-badge--${invitation.status}`;

  return (
    <div className="invitation-card">
      <div className="invitation-card__top">
        <div>
          <p className="invitation-card__camp">{invitation.campTitle}</p>
          <div className="invitation-card__meta">
            <span>To: <strong>{invitation.toEmail}</strong></span>
            <span className="invitation-card__role-badge">{invitation.role}</span>
            <span className="invitation-card__date">{invitation.createdAt}</span>
          </div>
        </div>
        <span className={statusClass}>{STATUS_LABELS[invitation.status]}</span>
      </div>

      {invitation.message && (
        <p className="invitation-card__message">"{invitation.message}"</p>
      )}
    </div>
  );
}

function InvitationsPage() {
  const [activeTab, setActiveTab] = useState("received");
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getInvitationsByUser("currentUser").then(({ received: r, sent: s }) => {
      if (isMounted) {
        setReceived(r);
        setSent(s);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const handleAccept = async (id) => {
    await updateInvitationStatus(id, "accepted");
    setReceived((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "accepted" } : inv))
    );
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
          <h1>My Invitations</h1>
          <p>Manage camp invitations you've received or sent to others.</p>
        </div>

        <div className="invitations-page__tabs">
          <button
            className={`invitations-page__tab ${activeTab === "received" ? "invitations-page__tab--active" : ""}`}
            onClick={() => setActiveTab("received")}
          >
            🔔 Received
            {pendingCount > 0 && (
              <span className="invitations-page__tab-count">{pendingCount}</span>
            )}
          </button>
          <button
            className={`invitations-page__tab ${activeTab === "sent" ? "invitations-page__tab--active" : ""}`}
            onClick={() => setActiveTab("sent")}
          >
            📤 Sent
          </button>
        </div>

        {loading ? (
          <p className="invitations-page__loading">Loading invitations...</p>
        ) : activeTab === "received" ? (
          received.length === 0 ? (
            <div className="invitations-page__empty">
              <div className="invitations-page__empty-icon">📭</div>
              <p>You haven't received any invitations yet.</p>
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
              <p>You haven't sent any invitations yet. Go to a camp and invite a volunteer!</p>
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
