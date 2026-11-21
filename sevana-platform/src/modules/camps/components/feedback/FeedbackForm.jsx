import { useState } from "react";
import { submitFeedback } from "../../services/feedbackService";
import { useAuth } from "../../context/useAuth";
import Button from "../common/Button";
import "./FeedbackForm.css";

export default function FeedbackForm({ campId, onSubmitted }) {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  if (!isAuthenticated) return <p>Sign in to leave feedback after verified attendance.</p>;
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError("");
    try { await submitFeedback(campId, { rating, comment }); setSaved(true); onSubmitted?.(); }
    catch (requestError) { setError(requestError.message || "Unable to submit feedback."); }
    finally { setSaving(false); }
  };
  return <form className="feedback-form" onSubmit={submit}><h3>Share your camp feedback</h3><label>Rating<select value={rating} onChange={(event) => setRating(Number(event.target.value))}>{[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} star{value > 1 ? "s" : ""}</option>)}</select></label><label>Comment<textarea minLength="10" maxLength="3000" required value={comment} onChange={(event) => setComment(event.target.value)} rows="4" /></label>{error && <p role="alert">{error}</p>}{saved && <p role="status">Feedback saved.</p>}<Button type="submit" disabled={saving}>{saving ? "Saving…" : "Submit feedback"}</Button></form>;
}
