import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LogIn from './LogIn';
import SignUp from './SignUp';
import ResetPassword from './ResetPassword';
import Dashboard from './Dashboard';
import { useAuth } from './context/AuthContext';
import BurgerMenu from './BurgerMenu';
import UserProfile from './UserProfile';

function App() {
  const { isAuthenticated } = useAuth();

  // Rutas protegidas: solo se deben mostrar si el usuario está autenticado
  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/" />;
  };

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {/* Mostrar el menú de navegación solo si el usuario está autenticado */}
        {isAuthenticated && (
          <div style={{ width: '250px', position: 'fixed', zIndex: 100 }}>
            <BurgerMenu />
          </div>
        )}

        {/* Contenedor principal que contiene las rutas de contenido */}
        <div style={{ marginLeft: isAuthenticated ? '250px' : '0', width: '100%' }}>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/resetpassword" element={<ResetPassword />} />

            {/* Ruta protegida: solo accesible si el usuario está autenticado */}
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/profile" element={<ProtectedRoute element={<UserProfile />} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;