import './css/index.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LogIn from './LogIn';
import SignUp from './SignUp';
import ResetPassword from './ResetPassword';
import Dashboard from './Dashboard';
import { useAuth } from './context/AuthContext';
import UserProfile from './UserProfile';
import VotacionPage from './Votacion';
import AdminLogIn from './AdminLogIn';
import Navbar from './componentes/Navbar';
import Candidato from './candidatos';
import PartidosPoliticos from './Partidospoliticos';
import BurgerMenu from './componentes/BurgerMenu';
import BMenu from './componentes/BMenu';
function App() {
  const { isAuthenticated } = useAuth();

  // ProtectedRoute: Only accessible if authenticated
  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LogIn />} />
        <Route path="/Navbar" element={<Navbar />} />
        <Route path="/" element={<AdminLogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/resetpassword" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<UserProfile />} />} />
        <Route path="/votacion" element={<ProtectedRoute element={<VotacionPage />} />} />
        <Route path="/candidato" element={<ProtectedRoute element={<Candidato />} />} />
        <Route path="/partidos" element={<ProtectedRoute element={<PartidosPoliticos />} />} />
      </Routes>
    </Router>
  );
}

export default App;
