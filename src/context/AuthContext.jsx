import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar si hay un estado de autenticación y datos del usuario almacenados en el localStorage
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('user');

    if (storedAuth === 'true' && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error al analizar los datos del usuario:', error);
        localStorage.removeItem('user'); // Eliminar datos de usuario inválidos
      }
    }
  }, []);


  const fetchCandidatos = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3001/api/candidatos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      const data = await response.json();
      setCandidatos(data); // Guardamos los datos en el estado global
    } catch (error) {
      console.error('Error al obtener candidatos:', error);
    }
  };

  // Función de login (ahora igual que loginAdmin)
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
        setIsAuthenticated(true);
        setUser(data.user);

        // Guardar estado en localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(data.user));

        return { status: 200, message: data.message, user: data.user };
      } else {
        return { status: response.status, error: data.error || 'Error al iniciar sesión.' };
      }
    } catch (error) {
      console.error('Error al intentar iniciar sesión:', error);
      return { status: 500, error: 'Ocurrió un error al intentar iniciar sesión.' };
    }
  };

  // Función de loginAdmin
  const loginAdmin = async (userData) => {
    try {
      const response = await fetch('http://127.0.0.1:3001/api/loginAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setUser(data.user);

        // Guardar estado en localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(data.user));

        return { status: 200, message: data.message, user: data.user };
      } else {
        return { status: response.status, error: data.error || 'Error al iniciar sesión.' };
      }
    } catch (error) {
      console.error('Error al intentar iniciar sesión:', error);
      return { status: 500, error: 'Ocurrió un error al intentar iniciar sesión.' };
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);

    // Limpiar localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, loginAdmin, logout, fetchCandidatos }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
