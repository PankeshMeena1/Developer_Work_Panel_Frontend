import React from "react";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar className="navbar-custom sticky-top px-4 py-3 shadow-sm">
      <div className="d-flex align-items-center">
        <button
          className="btn btn-link text-white p-0 me-3"
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars fa-lg"></i>
        </button>
        <Navbar.Brand className="text-white mb-0 fw-bold">
          Developer Work Tracker
        </Navbar.Brand>
      </div>

      <Nav className="ms-auto align-items-center">
        <div className="d-flex align-items-center">
          <div className="bg-white rounded-circle p-2 me-2">
            <i className="fas fa-user text-primary"></i>
          </div>
          <span className="d-none d-md-inline text-white">{user?.name}</span>

          {/* Only this icon opens the dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle
              as="span"
              className="ms-2"
              style={{ cursor: "pointer" }}
              id="user-dropdown"
            >
              <i className="fas fa-chevron-down text-white"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/profile">
                <i className="fas fa-user me-2"></i>
                Profile
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-2"></i>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Nav>
    </Navbar>
  );
};

export default Header;
