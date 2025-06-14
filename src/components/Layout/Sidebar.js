import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/updates', icon: 'fas fa-clipboard-list', label: 'Updates' },
    { path: '/profile', icon: 'fas fa-user', label: 'Profile' },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'show' : ''}`}>
      <div className="p-4">
        <div className="text-center mb-4">
          <i className="fas fa-clipboard-list fa-2x text-white mb-2"></i>
          <h4 className="text-white fw-bold">Work Updates</h4>
        </div>
        
        <Nav className="flex-column">
          {menuItems.map((item, index) => (
            <Nav.Link
              key={index}
              as={Link}
              to={item.path}
              className={`text-white py-3 px-3 rounded mb-2 d-flex align-items-center ${
                location.pathname === item.path ? 'bg-white bg-opacity-25' : ''
              }`}
              style={{ textDecoration: 'none' }}
            >
              <i className={`${item.icon} me-3`}></i>
              {item.label}
            </Nav.Link>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;