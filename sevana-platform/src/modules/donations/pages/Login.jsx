import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { SEED_USERS } from "../services/authService";
import Button from "../components/common/Button";
import "./Login.css";

function Login() {
  const { login, loginDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to log in.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = (demoEmail, demoPassword) => {
    setError("");
    setSubmitting(true);
    try {
      loginDemo(demoEmail, demoPassword);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to start the synthetic demo session.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="container auth-page__container">
        <div className="auth-card">
          <div className="auth-card__header">
            
            <h1>Welcome Back to Sevana</h1>
            <p>Sign in with an account registered in Sevana. Sample accounts open a separate local demo session.</p>
          </div>

          {error && <div className="auth-card__alert auth-card__alert--error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-form__field">
              <span>Email Address</span>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label className="auth-form__field">
              <span>Password</span>
              <div className="auth-form__password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="auth-form__toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <Button type="submit" variant="accent" size="lg" fullWidth disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="auth-card__divider">
            <span>Or explore the synthetic demo</span>
          </div>

          <div className="auth-card__quick-demo">
            <p className="auth-card__demo-title">Demo sessions (not backend accounts):</p>
            <div className="auth-card__demo-pills">
              {SEED_USERS.map((seed) => (
                <button
                  key={seed.id}
                  type="button"
                  className="demo-pill"
                  onClick={() => handleQuickDemo(seed.email, seed.password)}
                  disabled={submitting}
                >
                  <img src={seed.avatar} alt={seed.name} className="demo-pill__avatar" />
                  <div className="demo-pill__text">
                    <strong>{seed.name.split(" ")[0]}</strong>
                    <span>{seed.role.split("&")[0]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="auth-card__footer">
            <p>
              New to Sevana?{" "}
              <Link to="/register" state={{ from }}>
                Create an account →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;

