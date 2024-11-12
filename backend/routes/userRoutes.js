import express from 'express';
import { signup, login, getUserByCedula } from '../controllers/userController.js';
import { body } from 'express-validator';

const router = express.Router();

// Ruta para registro de usuario
router.post('/signup', 
  body('cedula').isLength({ min: 8 }).withMessage('La cédula debe tener al menos 8 caracteres'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
  signup
);

// Ruta para inicio de sesión
router.post('/login', 
  body('cedula').isLength({ min: 8 }).withMessage('La cédula debe tener al menos 8 caracteres'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
  login
);

// Ruta para obtener datos de usuario por cédula
router.get('/users/:cedula', getUserByCedula);

export default router;
