import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

// Conexión a la base de datos (deberás importarla desde el archivo de base de datos)
import { db } from '../server.js';

// Función para generar el token JWT
const generateToken = (user) => {
  return jwt.sign({ cedula: user.cedula_v, nombre: user.nombre_v }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Función para registrar un usuario
export const signup = async (req, res) => {
  const { nombre, apellido, fechaNacimiento, cedula, email, password } = req.body;

  // Validación de entradas
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      `INSERT INTO votante (nombre_v, apellido_v, cedula_v, fecha_naci, correo, contraseña)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, cedula, fechaNacimiento, email, hashedPassword]
    );
    res.status(201).send({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).send({ error: 'Error al registrar usuario' });
  }
};

// Función para iniciar sesión
export const login = async (req, res) => {
  const { cedula, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM votante WHERE cedula_v = ?', [cedula]);

    if (rows.length > 0) {
      const user = rows[0];

      // Verificar la contraseña con la contraseña encriptada
      const isPasswordValid = await bcrypt.compare(password, user.contraseña);

      if (isPasswordValid) {
        const token = generateToken(user);
        res.status(200).send({ message: 'Inicio de sesión exitoso', token });
      } else {
        res.status(401).send({ error: 'Cédula o contraseña incorrectos' });
      }
    } else {
      res.status(401).send({ error: 'Cédula o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).send({ error: 'Error al iniciar sesión' });
  }
};

// Función para obtener datos de usuario
export const getUserByCedula = async (req, res) => {
  const { cedula } = req.params;

  try {
    const [rows] = await db.execute('SELECT nombre_v, apellido_v, correo, rol FROM votante WHERE cedula_v = ?', [cedula]);

    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    res.status(500).send({ error: 'Error al obtener los datos del usuario' });
  }
};
