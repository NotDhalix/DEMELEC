import './index.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LogIn from './LogIn';
import SignUp from './SignUp';
import ResetPassword from './ResetPassword';
import Dashboard from './Dashboard';
import { useAuth } from './context/AuthContext';
import BurgerMenu from './BurgerMenu';
import UserProfile from './UserProfile';
import VotacionPage from './Votacion';
import AdminLogIn from './AdminLogIn';

function App() {
  const { isAuthenticated } = useAuth();

  // ProtectedRoute: Only accessible if authenticated
  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/" />;
  };

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {/* Display the BurgerMenu only if authenticated */}
        {isAuthenticated && (
          <div style={{ width: '250px', position: 'fixed', zIndex: 100 }}>
            <BurgerMenu />
          </div>
        )}

        {/* Main container containing route content */}
        <div style={{ marginLeft: isAuthenticated ? '250px' : '0', width: '100%' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LogIn />} />
            <Route path="/adminLogin" element={<AdminLogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/resetpassword" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/profile" element={<ProtectedRoute element={<UserProfile />} />} />
            <Route path="/votacion" element={<ProtectedRoute element={<VotacionPage />} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
