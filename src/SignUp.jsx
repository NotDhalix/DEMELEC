import './index.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'boxicons';

function SignUp() {
  // Establecer el título de la pestaña cuando el componente se monte
  useEffect(() => {
    document.title = 'Registrarse';
  }, []); // Este hook solo se ejecutará una vez cuando el componente se monte

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const navigate = useNavigate(); // Usado para redirigir después del registro exitoso

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar que los correos y contraseñas coinciden
    if (email !== emailConfirm) {
      alert('Los correos electrónicos no coinciden');
      return;
    }

    if (password !== passwordConfirm) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Crear el objeto con los datos del usuario
    const userData = {
      nombre: nombre,
      apellido: apellido,
      fechaNacimiento: fechaNacimiento,
      cedula: cedula,
      email: email,
      password: password,
    };

    try {
      // Enviar la solicitud de registro al servidor
      const response = await fetch('http://localhost:3001/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      // Verificar la respuesta del servidor
      if (response.status === 201) {
        alert(data.message); // Mensaje de éxito
        navigate('/'); // Redirigir a la página de login
      } else {
        alert(data.error); // Mostrar error
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert('Hubo un error al intentar registrarse.');
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Registrarse</h1>

        <div className="input-box">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <box-icon type="solid" name="user" color="white"></box-icon>
        </div>

        <div className="input-box">
          <input
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
          <box-icon name="user" color="white"></box-icon>
        </div>

        <div className="input-box">
          <input
            type="text"
            placeholder="DD/MM/AAAA"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            required
          />
          <box-icon name="calendar" color="white"></box-icon>
          <label>Fecha de nacimiento</label>
        </div>

        <div className="input-box">
          <input
            type="text"
            placeholder="8-888-888"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            required
          />
          <box-icon type="solid" name="id-card" color="white"></box-icon>
          <label>Cédula</label>
        </div>

        <div className="input-box">
          <input
            type="email"
            placeholder="example@enterprise.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <box-icon name="envelope" type="solid" color="white"></box-icon>
          <label>Correo electrónico</label>
        </div>

        <div className="input-box">
          <input
            type="email"
            placeholder="Repita su correo electrónico"
            value={emailConfirm}
            onChange={(e) => setEmailConfirm(e.target.value)}
            required
          />
          <box-icon name="envelope" color="white"></box-icon>
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

        <div className="input-box">
          <input
            type="password"
            placeholder="Repita su contraseña"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
          <box-icon name="lock-alt" color="white"></box-icon>
        </div>

        <button type="submit" className="btn">Registrarse</button>

        <div className="register-link">
          <p>¿Ya tiene una cuenta? <Link to="/">Iniciar Sesión</Link></p>
        </div>
      </form>
    </div>
  );
}

export default SignUp;