import './index.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'boxicons';

function LogIn() {
  // Establecer el título de la pestaña cuando el componente se monte
  useEffect(() => {
    document.title = 'Iniciar Sesión';
  }, []); // El array vacío asegura que solo se ejecute una vez cuando el componente se monte

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de carga
  const navigate = useNavigate(); // Usado para redirigir después del login exitoso

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos vacíos
    if (!username || !password) {
      alert('Por favor ingrese su cédula y contraseña.');
      return;
    }

    // Crear el objeto de datos para la solicitud
    const userData = {
      cedula: username, // Aquí usas username como cédula
      password: password,
    };

    setLoading(true); // Iniciar estado de carga

    try {
      // Enviar la solicitud de inicio de sesión al servidor
      const response = await fetch('http://127.0.0.1:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      // Verificar el estado de la respuesta
      if (response.status === 200) {
        // Si la respuesta es exitosa, redirigir al usuario a la página principal (o dashboard)
        alert(data.message);
        
        // Si "Recuérdame" está seleccionado, guardar la sesión
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(data.user)); // Guardar la información del usuario
        }

        navigate('/main'); // Cambiar '/main' por la ruta que quieras después de un login exitoso
      } else {
        // Si la respuesta no es exitosa, mostrar un mensaje de error
        alert(data.error || 'Hubo un problema al iniciar sesión.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Hubo un error al intentar iniciar sesión.');
    } finally {
      setLoading(false); // Finalizar estado de carga
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
