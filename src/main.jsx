import './css/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client'; // Ensure to import from 'react-dom/client'
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider to wrap your app

// Create root container and wrap App with AuthProvider
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* AuthProvider wraps the app to provide authentication context */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
