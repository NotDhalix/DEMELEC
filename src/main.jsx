import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';  // Asegúrate de importar desde 'react-dom/client'
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext'; // Importa el AuthProvider para envolver tu aplicación

// Crea el contenedor raíz y envuelve la aplicación con el AuthProvider
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* El AuthProvider envuelve la aplicación para proporcionar el contexto */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
