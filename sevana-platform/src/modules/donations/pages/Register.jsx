import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Register.css";

const ORGANIZATION_TYPES = ["NGO", "SCHOOL", "COLLEGE", "NSS", "NCC", "COMPANY", "COMMUNITY_GROUP", "OTHER"];

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "", accountType: "INDIVIDUAL", organizationName: "", organizationType: "NGO", organizationDescription: "" });
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const payload = { ...form };
      if (!payload.phone.trim()) delete payload.phone;
      if (payload.accountType !== "ORGANIZATION") {
        delete payload.organizationName;
        delete payload.organizationType;
        delete payload.organizationDescription;
      }
      await register(payload);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed. Please check your details and try again.");
    }
  };

  return (
    <section className="register-page">
      <div className="container register-page__container">
        <div className="register-card">
          <div className="register-card__header">
            <h1>Create your Sevana account</h1>
            <p>Your account is created by the Sevana backend. Choose an account type to continue.</p>
          </div>
          {error && <div className="register-card__alert register-card__alert--error" role="alert">{error}</div>}
          <form className="register-form" onSubmit={submit}>
            <label className="register-form__field"><span>Full name</span><input required minLength={2} maxLength={120} autoComplete="name" value={form.fullName} onChange={(event) => update("fullName", event.target.value)} /></label>
            <label className="register-form__field"><span>Email</span><input required type="email" maxLength={255} autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} /></label>
            <label className="register-form__field"><span>Password (8–72 characters)</span><input required type="password" minLength={8} maxLength={72} autoComplete="new-password" value={form.password} onChange={(event) => update("password", event.target.value)} /></label>
            <label className="register-form__field"><span>Phone (optional)</span><input type="tel" maxLength={20} autoComplete="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} /></label>
            <label className="register-form__field"><span>Account type</span><select value={form.accountType} onChange={(event) => update("accountType", event.target.value)}><option value="INDIVIDUAL">Individual</option><option value="ORGANIZATION">Organization</option></select></label>
            {form.accountType === "ORGANIZATION" && <>
              <label className="register-form__field"><span>Organization name</span><input required maxLength={180} value={form.organizationName} onChange={(event) => update("organizationName", event.target.value)} /></label>
              <label className="register-form__field"><span>Organization type</span><select required value={form.organizationType} onChange={(event) => update("organizationType", event.target.value)}>{ORGANIZATION_TYPES.map((type) => <option key={type} value={type}>{type.replaceAll("_", " ")}</option>)}</select></label>
              <label className="register-form__field"><span>Organization description (optional)</span><textarea rows={3} value={form.organizationDescription} onChange={(event) => update("organizationDescription", event.target.value)} /></label>
            </>}
            <button className="register-submit" type="submit" disabled={loading}>{loading ? "Creating account..." : "Create account"}</button>
          </form>
          <div className="register-card__footer">Already registered? <Link to="/login">Sign in</Link></div>
        </div>
      </div>
    </section>
  );
}
