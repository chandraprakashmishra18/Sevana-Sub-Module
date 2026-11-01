import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "./Button";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
