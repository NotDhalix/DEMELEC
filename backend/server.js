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

app.get('/api/users/:cedula', async (req, res) => {
  const cedula = req.params.cedula;
  try {
    const [rows] = await db.query('SELECT * FROM admin   WHERE cedula = ?', [cedula]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


// Endpoint para actualizar la información del usuario
app.put('/api/users/:cedula', async (req, res) => {
  const { cedula } = req.params;
  const updatedData = req.body;

  try {
    // Verifica si el usuario existe en la base de datos
    const [rows] = await db.execute('SELECT * FROM votante WHERE cedula_v = ?', [cedula]);

    if (rows.length > 0) {
      // El usuario existe, proceder con la actualización
      const [updateResult] = await db.execute(
        `UPDATE votante SET nombre = ?, correo = ?, telefono = ?, fotoPerfil = ? WHERE cedula_v = ?`,
        [
          updatedData.nombre,
          updatedData.correo,
          updatedData.telefono,
          updatedData.fotoPerfil, // Puede ser un base64 si es una imagen
          cedula
        ]
      );

      if (updateResult.affectedRows > 0) {
        res.status(200).send({ message: 'Datos actualizados correctamente' });
      } else {
        res.status(400).send({ error: 'No se pudo actualizar los datos' });
      }
    } else {
      res.status(404).send({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).send({ error: 'Error al actualizar usuario' });
  }
});

app.get('/api/partidopolitico', async (req, res) => {
  try {
    // Obtener todos los candidatos
    const [rows] = await db.execute('SELECT * FROM partidopolitico');
    // Respuesta exitosa
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener pp:', error);
    res.status(500).json({ error: 'Error al obtener los pp' });
  }
});
app.get('/api/votante', async (req, res) => {
  try {
    // Obtener todos los candidatos
    const [rows] = await db.execute('SELECT * FROM votantes');
    // Respuesta exitosa
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener v:', error);
    res.status(500).json({ error: 'Error al obtener los v' });
  }
});

app.get('/api/candidatos', async (req, res) => {
  try {
    // Obtener todos los candidatos junto con la información del partido político
    const query = `
      SELECT c.*, pp.*
      FROM candidatos c
      INNER JOIN partidopolitico pp ON c.id_pp = pp.id_pp
    `;

    const [rows] = await db.execute(query);

    // Respuesta exitosa
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener candidatos:', error);
    res.status(500).json({ error: 'Error al obtener los candidatos' });
  }
});

app.get('/api/votos', async (req, res) => {
  try {
    // Your original query
    const query = `
      SELECT v.*, c.*, e.*
      FROM votos v
      INNER JOIN candidatos c ON c.id_candidato = v.id_candidato
      INNER JOIN elecciones e ON e.id_elecciones = v.id_elecciones;
    `;
    const [rows] = await db.execute(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener votos:', error);
    res.status(500).json({ error: 'Error al obtener los votos', details: error.message });
  }
});

// Endpoint para registrar un voto
app.post('/api/votar/:idCandidato', (req, res) => {
  const candidatoId = req.params.idCandidato;

  // Validar que el ID del candidato es un número
  if (!candidatoId || isNaN(candidatoId)) {
    return res.status(400).json({ error: 'ID de candidato inválido' });
  }

  // Incrementar el contador de votos para el candidato en la base de datos
  const query = 'UPDATE votos SET cantidad_votos = cantidad_votos + 1 WHERE id = ?';

  db.query(query, [candidatoId], (err, result) => {
    if (err) {
      console.error('Error al registrar el voto:', err);
      return res.status(500).json({ error: 'Error al registrar el voto' });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: 'Voto registrado con éxito' });
    } else {
      return res.status(404).json({ error: 'Candidato no encontrado' });
    }
  });
});

// Iniciar el servidor
app.listen(3001, () => {
  console.log('Servidor escuchando en el puerto 3001');
});