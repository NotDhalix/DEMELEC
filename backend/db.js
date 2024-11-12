// backend/db.js
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Añade la contraseña si es necesaria
  database: 'demelec' // Nombre de la base de datos
});

console.log('Conectado a la base de datos MySQL');

export default connection;