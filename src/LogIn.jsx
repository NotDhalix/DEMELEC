import './css/index.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'boxicons';
import { useAuth } from './context/AuthContext'; // Importa el hook de autenticación

function LogIn() {
  useEffect(() => {
    document.title = 'Iniciar Sesión';
    
  }, []);


  

  const { login } = useAuth(); // Usamos el login del contexto de autenticación
  const [username, setUsername] = useState('');  // Cedula
  const [password, setPassword] = useState('');  // Contraseña
  const [rememberMe, setRememberMe] = useState(false);  // Recuérdame
  const [loading, setLoading] = useState(false);  // Indicador de carga
  const navigate = useNavigate();  // Navegación de React Router

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

    setLoading(true);  // Inicia la carga

    try {
      const response = await login(userData); // Usamos la función login del contexto

      if (response.status === 200) {
        // Si la respuesta es exitosa, almacenamos los datos del usuario
        if (rememberMe) {
          // Guardamos los datos del usuario en localStorage si 'Recuérdame' está activado
          localStorage.setItem('user', JSON.stringify(response.user)); // Guardamos el objeto como JSON
        }
        navigate('/dashboard'); // Redirige al dashboard si el login es exitoso
      } else {
        alert(response.error || 'Hubo un problema al iniciar sesión.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Hubo un error al intentar iniciar sesión.');
    } finally {
      setLoading(false); // Detiene la carga al finalizar
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Iniciar Sesión</h1>

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
        <div className="register-link">
          <p>
            ¿No tiene una cuenta? <Link to="/signup">Regístrese aquí</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
export default LogIn;
