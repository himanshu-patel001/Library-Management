import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark cgpit-navbar shadow">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center text-decoration-none" to="/">
          <div className="cgpit-logo-badge">
            <img
              src="/cgpit-logo.svg"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/cgpit-logo.png";
              }}
              alt="CGPIT Logo"
              className="cgpit-logo-img"
            />
          </div>
          <div className="cgpit-brand-text-container">
            <div className="cgpit-brand-title">
              <span className="cgpit-brand-gold">CGPIT</span>
              <span className="cgpit-brand-white">LIBRARY</span>
            </div>
            <span className="cgpit-brand-sub">Uka Tarsadia University</span>
          </div>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
          <ul className="navbar-nav me-auto ms-lg-4">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/books" onClick={() => setMenuOpen(false)}>
                Books
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/category" onClick={() => setMenuOpen(false)}>
                Categories
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/aboutus" onClick={() => setMenuOpen(false)}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contactus" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav align-items-center">
            {token ? (
              <li className="nav-item dropdown">
                <button
                  className="btn cgpit-btn-profile dropdown-toggle d-flex align-items-center gap-1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span>👤</span> Profile
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow">
                  <li>
                    <Link className="dropdown-item" to="/user">
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <li className="nav-item">
                  <Link className="cgpit-btn-login" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="cgpit-btn-signup" to="/register">
                    Signup
                  </Link>
                </li>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}