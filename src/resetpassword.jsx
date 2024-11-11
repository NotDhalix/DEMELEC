import React, { useState } from 'react';

function ResetPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/restablecer-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Se ha enviado un enlace de restablecimiento a tu correo');
      } else {
        alert('Hubo un problema al enviar el correo');
      }
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      alert('Hubo un error, por favor intenta de nuevo más tarde');
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Restablecer Contraseña</h1>

        <div className="input-box">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn">
          Enviar enlace de restablecimiento
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
