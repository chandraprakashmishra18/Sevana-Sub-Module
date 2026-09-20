import { useState } from "react";
import Button from "../components/common/Button";
import "./Contact.css";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const isValid = form.name.trim() && form.email.trim() && form.message.trim();

  return (
    <section className="contact-page">
      <div className="container contact-page__grid">
        <div className="contact-page__info">
          <h1>Get in Touch</h1>
          <p>
            Questions about a camp, want your school or NGO to become an
            organizer, or need help joining as a worker? Reach out.
          </p>

          <div className="contact-info__item">
            <span>📧</span>
            <div>
              <p className="contact-info__label">Email</p>
              <p>camps@sevana.org</p>
            </div>
          </div>

          <div className="contact-info__item">
            <span>📞</span>
            <div>
              <p className="contact-info__label">Phone</p>
              <p>+91 98765 43210</p>
            </div>
          </div>

          <div className="contact-info__item">
            <span>📍</span>
            <div>
              <p className="contact-info__label">Office</p>
              <p>Gurugram, Haryana, India</p>
            </div>
          </div>
        </div>

        <div className="contact-page__form-wrap">
          {submitted ? (
            <div className="contact-page__success">
              <span className="contact-page__success-icon">✔</span>
              <h2>Message Sent!</h2>
              <p>Thanks for reaching out — we'll get back to you shortly.</p>
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                Send Another Message
              </Button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>
                <span>Full Name *</span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </label>

              <label>
                <span>Email *</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </label>

              <label>
                <span>Message *</span>
                <textarea
                  name="message"
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help?"
                />
              </label>

              <Button
                type="submit"
                variant="accent"
                size="lg"
                fullWidth
                disabled={!isValid}
              >
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default Contact;