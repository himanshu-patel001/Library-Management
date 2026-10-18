import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./adminnavbar.css";
import "./navbar.css";

export default function AdminNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark cgpit-navbar shadow">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center text-decoration-none" to="/admin">
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
            <span className="cgpit-brand-sub">Admin Portal • UTU</span>
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
              <Link className="nav-link" to="/admin" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
            </li>
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Books
              </Link>
              <ul className="dropdown-menu shadow" aria-labelledby="navbarDropdown">
                <li>
                  <Link className="dropdown-item" to="/admin/addbook" onClick={() => setMenuOpen(false)}>
                    Add Book
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/admin/viewbook" onClick={() => setMenuOpen(false)}>
                    View Books
                  </Link>
                </li>
              </ul>
            </li>

            {role === "librarian" ? (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/issuerequest" onClick={() => setMenuOpen(false)}>
                  Issue Request
                </Link>
              </li>
            ) : null}

            {role === "librarian" ? (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/returnrequest" onClick={() => setMenuOpen(false)}>
                  Return Request
                </Link>
              </li>
            ) : null}

            <li className="nav-item">
              <Link className="nav-link" to="/admin/issued" onClick={() => setMenuOpen(false)}>
                Books Borrowed
              </Link>
            </li>

            {role === "admin" ? (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/addlibrarian" onClick={() => setMenuOpen(false)}>
                  Add Librarian
                </Link>
              </li>
            ) : null}
          </ul>

          {/* User Auth Section */}
          <ul className="navbar-nav align-items-center">
            {token ? (
              <li className="nav-item dropdown">
                <button
                  className="btn cgpit-btn-profile dropdown-toggle d-flex align-items-center gap-1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span>👤</span> {role === "admin" ? "Admin" : "Librarian"}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow">
                  <li>
                    <Link className="dropdown-item" to="/admin">
                      Dashboard
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
              <li className="nav-item">
                <Link className="cgpit-btn-login" to="/admin/login">
                  Admin Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}