import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './index.css';

function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Cierra el menú cuando la ruta cambia
  useEffect(() => {
    setIsOpen(false);
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
          <ul>
            <li><Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link></li>
            <li><Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link></li>
            <li><Link to="/settings" onClick={() => setIsOpen(false)}>Settings</Link></li>
            <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BurgerMenu;
