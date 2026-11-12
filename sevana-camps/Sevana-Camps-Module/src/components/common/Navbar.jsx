import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import Button from "./Button";
import "./Navbar.css";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Camps", path: "/camps" },
    { name: "Organizers", path: "/organizers" },
    { name: "Past Camps", path: "/past-camps" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "🔔 Invitations", path: "/invitations" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">⛺</span>
          Sevana <span className="navbar__logo-sub">Camps</span>
        </Link>

        <nav className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `navbar__link ${isActive ? "navbar__link--active" : ""}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
          <a className="navbar__link" href="http://localhost:5173/">Donations &amp; Aid ↗</a>

          <Link to="/organize" onClick={() => setMenuOpen(false)}>
            <Button variant="accent" size="sm">Organize a Camp</Button>
          </Link>

          {/* Authentication Section in Navigation */}
          {isAuthenticated ? (
            <div className="navbar__user-menu" ref={dropdownRef}>
              <button
                type="button"
                className="navbar__user-button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-expanded={userDropdownOpen}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="navbar__user-avatar"
                />
                <div className="navbar__user-meta">
                  <span className="navbar__user-name">{user.name.split(" ")[0]}</span>
                  <span className="navbar__user-xp">🌟 {user.totalXP || 0} XP</span>
                </div>
                <span className="navbar__dropdown-arrow">▼</span>
              </button>

              {userDropdownOpen && (
                <div className="navbar__dropdown-card">
                  <div className="navbar__dropdown-header">
                    <img src={user.avatar} alt={user.name} className="dropdown-avatar" />
                    <div>
                      <p className="dropdown-name">{user.name}</p>
                      <p className="dropdown-role">{user.role}</p>
                      <span className="dropdown-badge">Level: {user.totalXP || 0} XP</span>
                    </div>
                  </div>

                  <div className="navbar__dropdown-links">
                    <Link
                      to="/profile"
                      className="dropdown-link"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      👤 My Volunteer Profile
                    </Link>
                    <Link
                      to="/invitations"
                      className="dropdown-link"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      🔔 My Camp Invitations
                    </Link>
                    <Link
                      to="/organize"
                      className="dropdown-link"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      ⛺ Organize New Camp
                    </Link>
                  </div>

                  <div className="navbar__dropdown-footer">
                    <button type="button" className="dropdown-logout-btn" onClick={handleLogout}>
                      🚪 Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth-actions">
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <button type="button" className="navbar__login-btn">
                  Log In
                </button>
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                <button type="button" className="navbar__register-btn">
                  Register
                </button>
              </Link>
            </div>
          )}
        </nav>

        <button
          className="navbar__toggle"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
