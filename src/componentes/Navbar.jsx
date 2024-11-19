
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/index.css'

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm.trim()}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/logo.png" alt="Logo" className="logo" /> {/* Reemplaza con tu ruta al logo */}
      </div>
      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-button">Buscar</button>
      </form>
    </nav>
  );
};

export default Navbar;
