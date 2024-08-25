// src/app.js
const express = require('express');
const cors = require('cors');
const dataRoutes = require('./src/routes/dataRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', dataRoutes);

module.exports = app;
