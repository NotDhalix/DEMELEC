import mysql from 'mysql2/promise';
import cors from 'cors';
import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'; // To use environment variables securely

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(cors());
app.use(express.json()); // Allows JSON requests

// Database connection configuration
let db;
async function initializeDatabase() {
  try {
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'demelec',
    });
    console.log('Connected to MySQL database');
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1); // Exit the process if the connection fails
  }
}

initializeDatabase();

// Email transporter configuration using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use environment variable for email
    pass: process.env.EMAIL_PASS, // Use environment variable for password
  },
});

// Password reset endpoint
app.post('/api/restablecer-password', async (req, res) => {
  const { cedula } = req.body;

  try {
    // Query to get the email address associated with the cedula
    const [rows] = await db.execute(
      'SELECT correo FROM votante WHERE cedula_v = ?',
      [cedula]
    );

    if (rows.length === 0) {
      console.error('User not found with the provided cedula.');
      return res.status(404).send({ error: 'Usuario no encontrado' });
    }

    const email = rows[0].correo;
    const resetLink = `https://tuapp.com/restablecer?cedula=${cedula}`;

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Restablecimiento de contraseña',
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetLink}">Restablecer contraseña</a>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Correo de restablecimiento enviado' });
  } catch (error) {
    console.error('Error in /api/restablecer-password:', error);
    res.status(500).send({ error: 'Error interno al procesar la solicitud' });
  }
});

// User registration endpoint
app.post('/api/signup', async (req, res) => {
  const { nombre, apellido, fechaNacimiento, cedula, email, password } = req.body;

  if (!nombre || !apellido || !fechaNacimiento || !cedula || !email || !password) {
    return res.status(400).send({ error: 'Todos los campos son requeridos' });
  }

  try {
    // Query to insert user into the database without password hashing
    const [result] = await db.execute(
      `INSERT INTO votante (nombre_v, apellido_v, cedula_v, fecha_naci, correo, contraseña)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, cedula, fechaNacimiento, email, password]
    );
    res.status(201).send({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send({ error: 'Error al registrar usuario' });
  }
});

// User login endpoint
app.post('/api/login', async (req, res) => {
  const { cedula, password } = req.body;

  if (!cedula || !password) {
    return res.status(400).send({ error: 'Cédula y contraseña son requeridas' });
  }

  try {
    // Query to get user by cedula
    const [rows] = await db.execute(
      'SELECT * FROM votante WHERE cedula_v = ? AND contraseña = ?',
      [cedula, password]
    );

    if (rows.length > 0) {
      res.status(200).send({ message: 'Inicio de sesión exitoso' });
    } else {
      res.status(401).send({ error: 'Cédula o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send({ error: 'Error al iniciar sesión' });
  }
});

// Example endpoint for fetching candidatos
app.get('/api/candidatos', async (req, res) => {
  try {
    // Query to fetch candidatos from the database
    const [rows] = await db.execute('SELECT * FROM candidatos');
    res.json(rows); // Send the candidatos as JSON
  } catch (error) {
    console.error('Error fetching candidatos:', error);
    res.status(500).send({ error: 'Error al obtener los candidatos' });
  }
});

// Start the server on port 3001
app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
