import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Button from "../components/common/Button";
import "./Register.css";

const ROLE_OPTIONS = [
  { value: "donor", label: "Donor / Philanthropist", desc: "Fund campaigns, aid kits, and support community projects." },
  { value: "volunteer", label: "Volunteer / Community Worker", desc: "Help with logistics, registrations, animal care, or general hands-on tasks." },
  { value: "doctor", label: "Doctor / Medical Specialist", desc: "Conduct medical checkups, eye tests, triage, or health consultations." },
  { value: "teacher", label: "Teacher / Educational Lead", desc: "Teach literacy, spoken English, STEM, career mentoring, or arts." },
  { value: "organizer", label: "NGO / Institution Organizer", desc: "List, coordinate, and host medical or educational community camps." },
  { value: "citizen", label: "General Citizen / Supporter", desc: "Support local causes and participate in community drives." },
];

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleType: "donor",
    phone: "",
    location: "Gurugram, Haryana",
    organization: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const selectedRoleObj = ROLE_OPTIONS.find((r) => r.value === formData.roleType);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: selectedRoleObj ? selectedRoleObj.label : "Donor & Supporter",
        roleType: formData.roleType,
        phone: formData.phone,
        location: formData.location,
        organization: formData.organization,
      });

      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to register account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="register-page">
      <div className="container register-page__container">
        <div className="register-card">
          <div className="register-card__header">
            <span className="register-card__icon">💖</span>
            <h1>Join the Sevana Community</h1>
            <p>
              Register your account to donate, track verified disbursement trails, and earn donor karma XP!
            </p>
            <div className="register-card__bonus">
              🎁 <strong>+50 Welcome XP</strong> awarded instantly upon registration!
            </div>
          </div>

          {error && <div className="register-card__alert register-card__alert--error">{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="register-form__row">
              <label className="register-form__field">
                <span>Full Name *</span>
                <input
                  type="text"
                  placeholder="e.g. Ananya Gupta"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                />
              </label>

              <label className="register-form__field">
                <span>Email Address *</span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="register-form__row">
              <label className="register-form__field">
                <span>Password * (min 6 chars)</span>
                <div className="register-form__password-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="register-form__toggle-pw"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              <label className="register-form__field">
                <span>Confirm Password *</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="register-form__field">
              <span>Primary Role / Interest *</span>
              <div className="register-role-grid">
                {ROLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`role-option ${formData.roleType === opt.value ? "role-option--selected" : ""}`}
                    onClick={() => updateField("roleType", opt.value)}
                  >
                    <div className="role-option__title">{opt.label}</div>
                    <div className="role-option__desc">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="register-form__row">
              <label className="register-form__field">
                <span>Phone Number (optional)</span>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </label>

              <label className="register-form__field">
                <span>City / Location</span>
                <input
                  type="text"
                  placeholder="e.g. Gurugram, Haryana"
                  value={formData.location}
                  onChange={(e) => updateField("location", e.target.value)}
                />
              </label>
            </div>

            {(formData.roleType === "organizer" || formData.roleType === "doctor" || formData.roleType === "donor") && (
              <label className="register-form__field">
                <span>Company / Foundation / Organization (optional)</span>
                <input
                  type="text"
                  placeholder="e.g. TechCorp CSR / Roshni Trust / Independent Philanthropist"
                  value={formData.organization}
                  onChange={(e) => updateField("organization", e.target.value)}
                />
              </label>
            )}

            <Button variant="accent" size="lg" fullWidth disabled={submitting}>
              {submitting ? "Creating Account..." : "Create Account & Claim +50 XP"}
            </Button>
          </form>

          <div className="register-card__footer">
            <p>
              Already registered?{" "}
              <Link to="/login" state={{ from }}>
                Sign In to your account →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;

