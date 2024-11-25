import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'boxicons';
import { useAuth } from './context/AuthContext';
import './css/index.css';
function AdminLogIn() {
  useEffect(() => {
    document.title = 'Iniciar Sesión Admin';
  }, []);

  const { loginAdmin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert('Por favor ingrese su cédula y contraseña.');
      return;
    }

    const userData = {
      cedula: username,
      password: password,
    };

    setLoading(true);

    try {
      const response = await loginAdmin(userData);

      if (response.status === 200) {
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        navigate('/dashboard');
      } else {
        alert(response.error || 'Hubo un problema al iniciar sesión.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Hubo un error al intentar iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="centrear">
      <div className="wrapper centrear">
      <form onSubmit={handleSubmit}>
        <h1>Iniciar Sesión Admin</h1>

        <div className="input-box">
          <input
            type="text"
            placeholder="Cédula"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <box-icon type="solid" name="user" color="white"></box-icon>
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <box-icon name="lock-alt" type="solid" color="white"></box-icon>
        </div>

        <div className="remember-forgot">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Recuérdame
          </label>
          <Link to="/resetpassword">Olvidó su contraseña</Link>
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Cargando...' : 'Iniciar sesión'}
        </button>

        
      </form>
    </div>
    </div>
    
  );
}

export default AdminLogIn;
