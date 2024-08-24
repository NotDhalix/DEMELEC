import './index.css';
import React from 'react';
import { Link } from 'react-router-dom';
import 'boxicons';

function LogIn() {
  return (
    <>
      <div className="wrapper">
        <form action="">
          <h1>Iniciar Sesión</h1>

          <div className="input-box">
            <input type="text" placeholder='Cédula' required />
            <box-icon type='solid' name='user' color="white"></box-icon>
          </div>

          <div className="input-box">
            <input type="password" placeholder='Contraseña' required />
            <box-icon name='lock-alt' type='solid' color="white"></box-icon>
          </div>
          
          <div className="remember-forgot">
            <label><input type="checkbox"/> Recuérdame </label>
            <a href='#'>Olvidé mi contraseña</a>
          </div>

          <button type='submit' className='btn'>Iniciar sesión</button>

          <div className="register-link">
            <p>¿No tiene una cuenta? <Link to='/signup'>Regístrese aquí</Link></p>
          </div>
        </form>
      </div>
    </>
  );
}

export default LogIn;
