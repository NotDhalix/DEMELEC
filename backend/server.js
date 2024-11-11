// backend/server.js
import express from 'express';
import connection from './db.js';

const app = express();
const port = 5000;

// Middleware para manejar JSON
app.use(express.json());

// Ruta de ejemplo para obtener datos
app.get('/api/data', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM demelec');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
