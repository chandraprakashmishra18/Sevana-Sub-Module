import { useState } from "react";
import { apiRequest } from "../../../shared/apiClient";
import "./Contact.css";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", website: "" });
  const [status, setStatus] = useState({ saving: false, error: "", success: "" });

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setStatus({ saving: true, error: "", success: "" });
    try {
      const response = await apiRequest("/contact", { method: "POST", body: form });
      setForm({ name: "", email: "", subject: "", message: "", website: "" });
      setStatus({ saving: false, error: "", success: response.message || "Your message was stored for review." });
    } catch (error) {
      setStatus({ saving: false, error: error.message || "Unable to store your message.", success: "" });
    }
  };

  return (
    <section className="contact-page">
      <div className="container contact-page__grid">
        <div className="contact-page__info">
          <h1>Get in Touch</h1>
          <p>
            Questions about a campaign, want your NGO to partner with Sevana,
            or need help with a donation? Reach out.
          </p>

          <div className="contact-info__item">
            
            <div>
              <p className="contact-info__label">Email</p>
              <p>support@sevana.org</p>
            </div>
          </div>

          <div className="contact-info__item">
            
            <div>
              <p className="contact-info__label">Phone</p>
              <p>+91 98765 43210</p>
            </div>
          </div>

          <div className="contact-info__item">
            
            <div>
              <p className="contact-info__label">📍 Office</p>
              <p>Gurugram, Haryana, India</p>
            </div>
          </div>
        </div>

        <div className="contact-page__form-wrap">
          <h2>Contact support</h2>
          {status.success ? <p className="contact-page__success" role="status">{status.success}</p> : (
            <form className="contact-form" onSubmit={submit}>
              <label><span>Your name</span><input name="name" autoComplete="name" required minLength={2} maxLength={120} value={form.name} onChange={update} /></label>
              <label><span>Email address</span><input name="email" type="email" autoComplete="email" required maxLength={255} value={form.email} onChange={update} /></label>
              <label><span>Subject</span><input name="subject" required minLength={3} maxLength={180} value={form.subject} onChange={update} /></label>
              <label><span>Message</span><textarea name="message" required minLength={10} maxLength={5000} rows={6} value={form.message} onChange={update} /></label>
              <label aria-hidden="true" style={{ position: "absolute", left: "-10000px" }}><span>Leave this field empty</span><input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update} /></label>
              {status.error && <p role="alert">{status.error}</p>}
              <button className="btn btn--accent btn--lg" type="submit" disabled={status.saving}>{status.saving ? "Storing message…" : "Send message"}</button>
              <p role="note">Messages are stored for review. They are not emailed by this application.</p>
            </form>
          )}
          <a className="btn btn--outline" href="mailto:support@sevana.org">Email support@sevana.org directly</a>
        </div>
      </div>
    </section>
  );
}

export default Contact;
