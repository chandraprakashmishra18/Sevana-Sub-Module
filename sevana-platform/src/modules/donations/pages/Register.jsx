import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
  return (
    <section className="register-page">
      <div className="container register-page__container">
        <div className="register-card">
          <div className="register-card__header">
            <h1>Registration is unavailable in demo mode</h1>
            <p>
              This staging demo uses synthetic sample accounts only. Do not enter
              real personal information or credentials.
            </p>
          </div>
          <div className="register-card__alert" role="note">
            New accounts require a secure backend registration flow. Until that
            is deployed, use one of the sample accounts on the sign-in page.
          </div>
          <Link className="register-demo-link" to="/login">Continue to sample account sign-in</Link>
        </div>
      </div>
    </section>
  );
}

export default Register;
