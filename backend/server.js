import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json()); // Para manejar JSON en las solicitudes

// Función para establecer la conexión con la base de datos
async function initializeDatabase() {
  try {
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'demelec',
    });
    console.log('Conectado a la base de datos MySQL');
    return db;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1); // Termina el proceso si falla la conexión a la base de datos
  }
}

// Inicializar base de datos
let db;
initializeDatabase().then((connection) => {
  db = connection;
});

// Endpoint para registro de usuario
app.post('/api/signup', async (req, res) => {
  const { nombre, apellido, fechaNacimiento, cedula, email, password } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO votante (nombre_v, apellido_v, cedula_v, fecha_naci, correo, contraseña)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, cedula, fechaNacimiento, email, password]
    );
    res.status(201).send({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).send({ error: 'Error al registrar usuario' });
  }
});

// Endpoint para iniciar sesión
app.post('/api/login', async (req, res) => {
  const { cedula, password } = req.body;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM votante WHERE cedula_v = ? AND contraseña = ?',
      [cedula, password]
    );

    if (rows.length > 0) {
      res.status(200).send({ message: 'Inicio de sesión exitoso' });
      // Puedes incluir un token o datos del usuario aquí según tus necesidades
    } else {
      res.status(401).send({ error: 'Cédula o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).send({ error: 'Error al iniciar sesión' });
  }
});

// Iniciar el servidor
app.listen(3001, () => {
  console.log('Servidor escuchando en el puerto 3001');
});
