import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './index.css';

function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth(); // Assuming `user` contains the logged-in user's details
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    setIsOpen(false); // Close the menu when the location changes
  }, [location]);

  return (
    <div className="burger-container">
      <div className={`burger-menu ${isOpen ? 'open' : ''}`}>
        <div className="burger-icon" onClick={toggleMenu}>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </div>
        <div className={`sidebar ${isOpen ? 'show' : ''}`}>
          {user && user.cedula ? (
            <p className="user-id">ID de Usuario: {user.cedula}</p> // Display the user's cedula
          ) : (
            <p className="user-id">ID de Usuario no disponible</p> // Fallback text if no cedula
          )}
          <ul>
            <li><Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link></li>
            <li><Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link></li>
            <li><Link to="/votacion" onClick={() => setIsOpen(false)}>Votacion</Link></li>
            <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BurgerMenu;
