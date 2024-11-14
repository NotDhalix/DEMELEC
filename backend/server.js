import mysql from 'mysql2/promise';
import cors from 'cors';
import express from 'express';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs'; // Importamos bcrypt para encriptar contraseñas
import dotenv from 'dotenv'; // Para usar variables de entorno de forma segura

dotenv.config(); // Cargar las variables de entorno del archivo .env

const app = express();
app.use(cors());
app.use(express.json()); // Permite solicitudes con datos JSON

// Configuración de la conexión a la base de datos
let db;
async function initializeDatabase() {
  try {
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'demelec',
    });
    console.log('Conectado a la base de datos MySQL');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1); // Salir si la conexión falla
  }
}

initializeDatabase();

// Configuración de nodemailer usando variables de entorno
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Usar variable de entorno para el correo
    pass: process.env.EMAIL_PASS, // Usar variable de entorno para la contraseña
  },
});

// Endpoint para restablecer la contraseña
app.post('/api/restablecer-password', async (req, res) => {
  const { cedula } = req.body;

  try {
    // Consultar el correo asociado con la cédula
    const [rows] = await db.execute(
      'SELECT correo FROM votante WHERE cedula_v = ?',
      [cedula]
    );

    if (rows.length === 0) {
      console.error('Usuario no encontrado con la cédula proporcionada');
      return res.status(404).send({ error: 'Usuario no encontrado' });
    }

    const email = rows[0].correo;
    const resetLink = `https://tuapp.com/restablecer?cedula=${cedula}`;

    // Opciones del correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Restablecimiento de contraseña',
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetLink}">Restablecer contraseña</a>`,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Correo de restablecimiento enviado' });
  } catch (error) {
    console.error('Error en /api/restablecer-password:', error);
    res.status(500).send({ error: 'Error interno al procesar la solicitud' });
  }
});

// Endpoint para registrar usuarios
app.post('/api/signup', async (req, res) => {
  const { nombre, apellido, fechaNacimiento, cedula, email, password } = req.body;

  if (!nombre || !apellido || !fechaNacimiento || !cedula || !email || !password) {
    return res.status(400).send({ error: 'Todos los campos son requeridos' });
  }

  try {
    // Encriptar la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);

    // Consultar si ya existe un usuario con esa cédula o correo
    const [existingUser] = await db.execute(
      'SELECT * FROM votante WHERE cedula_v = ? OR correo = ?',
      [cedula, email]
    );

    if (existingUser.length > 0) {
      return res.status(400).send({ error: 'El usuario con esta cédula o correo ya existe' });
    }

    // Insertar el nuevo usuario en la base de datos con la contraseña encriptada
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
});

// Endpoint para iniciar sesión de usuario
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


// **Login de Administrador** (Nuevo)
app.post('/api/loginAdmin', async (req, res) => {
  const { cedula, password } = req.body;

  if (!cedula || !password) {
    return res.status(400).send({ error: 'Cédula y contraseña son requeridas' });
  }

  try {
    // Consulta para obtener al usuario por cédula y contraseña
    const [rows] = await db.execute(
      'SELECT * FROM admin WHERE cedula = ? AND contra_admin = ?',
      [cedula, password]
    );

    if (rows.length > 0) {
      const user = rows[0]; // Suponiendo que el primer usuario es el que queremos
      res.status(200).send({ message: 'Inicio de sesión exitoso', user }); // Enviar datos del usuario
    } else {
      res.status(401).send({ error: 'Cédula o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error durante el login:', error);
    res.status(500).send({ error: 'Error al iniciar sesión' });
  }
});



// Endpoint de ejemplo para obtener candidatos
app.get('/api/candidatos', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM candidatos');
    res.json(rows); // Enviar los candidatos como JSON
  } catch (error) {
    console.error('Error al obtener candidatos:', error);
    res.status(500).send({ error: 'Error al obtener los candidatos' });
  }
});

// Iniciar el servidor en el puerto 3001
app.listen(3001, () => {
  console.log('Servidor escuchando en el puerto 3001');
});
