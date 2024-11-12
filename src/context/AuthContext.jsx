import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar el estado de autenticación y usuario guardado en localStorage cuando la aplicación se carga
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('user');

    if (storedAuth === 'true') {
      setIsAuthenticated(true);

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error al parsear el usuario:', error);
          localStorage.removeItem('user'); // Eliminar usuario si hay error de parsing
        }
      }
    }
  }, []);

  // Lógica de login
  const login = async (userData) => {
    try {
      const response = await fetch('http://127.0.0.1:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Si el login es exitoso, actualizamos el estado
        setIsAuthenticated(true);
        setUser(data.user);

        // Guardamos el estado en localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return { status: 200, message: data.message, user: data.user };
      } else {
        return { status: response.status, error: data.error || 'Error al iniciar sesión' };
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return { status: 500, error: 'Hubo un error al intentar iniciar sesión.' };
    }
  };

  // Lógica de logout
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);

    // Limpiar el almacenamiento local
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};