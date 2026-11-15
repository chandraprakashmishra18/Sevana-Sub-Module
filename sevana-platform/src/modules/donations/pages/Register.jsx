import { useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
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

const ORGANIZATION_TYPES = [
  ["NGO", "NGO"], ["SCHOOL", "School"], ["COLLEGE", "College"],
  ["NSS", "NSS"], ["NCC", "NCC"], ["COMPANY", "Company"],
  ["COMMUNITY_GROUP", "Community group"], ["OTHER", "Other"]
];

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const from = location.state?.from || (searchParams.get("type") === "organization" ? "/organization" : "/");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: searchParams.get("type") === "organization" ? "ORGANIZATION" : "INDIVIDUAL",
    organizationName: "",
    organizationType: "NGO",
    organizationDescription: "",
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

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (formData.accountType === "ORGANIZATION" && !formData.organizationName.trim()) {
      setError("Organization name is required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        fullName: formData.name.trim(),
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        accountType: formData.accountType,
        ...(formData.accountType === "ORGANIZATION" ? {
          organizationName: formData.organizationName.trim(),
          organizationType: formData.organizationType,
          organizationDescription: formData.organizationDescription.trim() || undefined
        } : {})
      });

      const destination = location.state?.from || (formData.accountType === "ORGANIZATION" ? "/organization" : "/dashboard");
      navigate(destination, { replace: true });
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
            <h1>Create your Sevana account</h1>
            <p>
              Use one account to participate in Sevana as an individual or register an organization.
            </p>
            <div className="register-card__bonus">
              Your credentials are securely stored by the Sevana backend.
            </div>
          </div>

          {error && <div className="register-card__alert register-card__alert--error">{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            <label className="register-form__field">
              <span>Account type *</span>
              <select
                value={formData.accountType}
                onChange={(e) => updateField("accountType", e.target.value)}
              >
                <option value="INDIVIDUAL">Individual</option>
                <option value="ORGANIZATION">Organization / NGO</option>
              </select>
            </label>

            {formData.accountType === "ORGANIZATION" && (
              <div className="register-form__row">
                <label className="register-form__field">
                  <span>Organization name *</span>
                  <input required value={formData.organizationName} onChange={(e) => updateField("organizationName", e.target.value)} />
                </label>
                <label className="register-form__field">
                  <span>Organization type *</span>
                  <select value={formData.organizationType} onChange={(e) => updateField("organizationType", e.target.value)}>
                    {ORGANIZATION_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                <label className="register-form__field register-form__field--wide">
                  <span>Organization description (optional)</span>
                  <textarea rows="3" value={formData.organizationDescription} onChange={(e) => updateField("organizationDescription", e.target.value)} />
                </label>
              </div>
            )}

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
                <span>Password * (min 8 chars)</span>
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

            {formData.accountType === "INDIVIDUAL" && <div className="register-form__field">
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
            </div>}

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

            <Button type="submit" variant="accent" size="lg" fullWidth disabled={submitting}>
              {submitting ? "Creating account…" : "Create account"}
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

