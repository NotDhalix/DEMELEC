import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import 'boxicons'
import './LogIn.css';


function SignUp (){


return(
    <>
       <div className="wrapper">
        <form action="">
          <h1>Registrarse</h1>

          <div className="input-box">
            <input type="text" placeholder='Nombre' required />
            <box-icon type='solid' name='user' color="white"></box-icon>
          </div>

          <div className="input-box">
            <input type="text" placeholder='Apellido' required />
            <box-icon name='user' color="white"></box-icon>
          </div>

          <div className="input-box">
            <input type="text" placeholder='DD/MM/AAA' required />
            <box-icon name='calendar' color='white'></box-icon>
            <label>Fecha de nacimiento</label>
          </div>

          <div className="input-box">
            <input type="text" placeholder='8-888-888' required />
            <box-icon type='solid' name='id-card' color="white"></box-icon>
            <label>Cédula</label>
          </div>

          <div className="input-box">
            <input type="text" placeholder='example@enterprise.com' required />
            <box-icon name='envelope'type='solid' color="white"></box-icon>
            <label>Correo electrónico</label>
          </div>

          <div className="input-box">
            <input type="text" placeholder='Repita su correo electrónico' required />
            <box-icon name='envelope' color="white"></box-icon>
          </div>

          <div className="input-box">
            <input type="password" placeholder='Contraseña' required />
            <box-icon name='lock-alt' type='solid' color="white"></box-icon>
          </div>

          <div className="input-box">
            <input type="password" placeholder='Repita su contraseña' required />
            <box-icon name='lock-alt' color="white"></box-icon>
          </div>


          <button type='submit' className='btn'>Registrarse</button>

          <div className="register-link">
            <p>¿Ya tiene una cuenta? <Link to='/'>Iniciar Sesión</Link></p>
          </div>
        </form>
      </div>

    </>
)


}

export default SignUp;