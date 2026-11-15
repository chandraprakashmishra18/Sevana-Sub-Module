import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import "./Navbar.css";

const LINKS = [
  ["Explore", "/campaigns"],
  ["Camps", "/camps"],
  ["Organizations", "/ngo-partners"],
  ["Impact", "/impact"],
  ["Leaderboard", "/leaderboard"],
  ["About", "/about"],
  ["Organize", "/organize"],
];

const ACCOUNT_LINKS = [
  ["Dashboard", "/dashboard"],
  ["Organization", "/organization"],
  ["Notifications", "/notifications"],
  ["Admin demo", "/admin"],
];

const linkClass = ({ isActive }) =>
  `navbar__link ${isActive ? "navbar__link--active" : ""}`;

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const closeAll = () => {
    setOpen(false);
    setMenuOpen(false);
  };

  const go = (path) => {
    closeAll();
    navigate(path);
  };

  const firstName = user?.name?.split(" ")[0] || "Account";

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link className="navbar__logo" to="/" onClick={closeAll}>
          <span className="navbar__logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </span>
          Sevana <span className="navbar__logo-sub">Community Services</span>
        </Link>

        <nav className={`navbar__links ${open ? "navbar__links--open" : ""}`} aria-label="Main">
          {LINKS.map(([label, path]) => (
            <NavLink key={path} to={path} className={linkClass} onClick={closeAll}>
              {label}
            </NavLink>
          ))}

          <NavLink to="/donate" className="navbar__donate" onClick={closeAll}>
            Donate
          </NavLink>

          {isAuthenticated ? (
            <div className="navbar__user-menu" ref={menuRef}>
              <button
                type="button"
                className="navbar__user-button"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className="navbar__user-initial">{firstName.charAt(0).toUpperCase()}</span>
                <span className="navbar__user-name">{firstName}</span>
                <span className="navbar__dropdown-arrow" aria-hidden="true">▾</span>
              </button>

              {menuOpen && (
                <div className="navbar__dropdown-card">
                  <div className="navbar__dropdown-links">
                    {ACCOUNT_LINKS.map(([label, path]) => (
                      <Link key={path} to={path} className="dropdown-link" onClick={closeAll}>
                        {label}
                      </Link>
                    ))}
                  </div>
                  <div className="navbar__dropdown-footer">
                    <button
                      type="button"
                      className="dropdown-logout-btn"
                      onClick={() => {
                        closeAll();
                        logout();
                        navigate("/");
                      }}
                    >
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth-actions">
              <button type="button" className="navbar__login-btn" onClick={() => go("/login")}>
                Log in
              </button>
              <button type="button" className="navbar__register-btn" onClick={() => go("/register")}>
                Join Sevana
              </button>
            </div>
          )}
        </nav>

        <button
          type="button"
          className="navbar__toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}