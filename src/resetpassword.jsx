import './index.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [cedula, setCedula] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cedula) {
      alert('Por favor ingrese su cédula.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/restablecer-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cedula }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Se ha enviado un enlace de restablecimiento a tu correo');
        } else {
          alert(data.error || 'Hubo un problema al enviar el correo');
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Hubo un error inesperado');
      }
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      alert('Hubo un error, por favor intenta de nuevo más tarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Restablecer Contraseña</h1>

        <div className="input-box">
          <input
            type="text"
            placeholder="Ingrese su Cédula"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar enlace de restablecimiento'}
        </button>

        <div className="register-link">
          <p>¿Ya tiene una cuenta? <Link to="/">Iniciar Sesión</Link></p>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
