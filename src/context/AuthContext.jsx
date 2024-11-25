import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [candidatos, setCandidatos] = useState([]);
  const [votos, setVotos] = useState([]);
  const [partidoPoliticos, setPartidoPoliticos] = useState([]);

  // Sincronizar autenticación y datos de usuario con localStorage
  useEffect(() => {
    if (isAuthenticated && !user) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error al analizar los datos del usuario:', error);
          localStorage.removeItem('user');
        }
      }
    }
  }, [isAuthenticated, user]);

  // Función de inicio de sesión
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

  // Función de inicio de sesión para administradores
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
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  // Función para obtener partidos políticos
  const fetchPartidopolitico = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3001/api/partidopolitico');
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      const data = await response.json();
      setPartidoPoliticos(data);
    } catch (error) {
      console.error('Error al obtener partidos políticos:', error);
    }
  };

  // Función para obtener candidatos
  const fetchCandidatos = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3001/api/candidatos');
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      const data = await response.json();
      setCandidatos(data);
    } catch (error) {
      console.error('Error al obtener candidatos:', error);
    }
  };

  const fetchVotantes = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3001/api/votantes');
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      const data = await response.json();
      setCandidatos(data);
    } catch (error) {
      console.error('Error al obtener votantes:', error);
    }
  };

  const fetchVotos = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3001/api/votos');
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      const data = await response.json();
      setVotos(data);
    } catch (err) {
      console.error('Error al registrar el voto:', err);
      alert('Ocurrió un error al registrar el voto');
    }
  };
  
  // Función para votar por un candidato
  const votarCandidato = async (idCandidato) => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/votar/${idCandidato}`, {
        method: 'POST',
        body: JSON.stringify({ candidatoId: idCandidato }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('No se pudo registrar el voto');
      }
      alert('Voto registrado con éxito');
    } catch (error) {
      console.error('Error al registrar el voto:', error);
      alert('Ocurrió un error al registrar el voto');
    }
  };

  const fetchAdminData = async (cedula) => {
  try {
    const response = await fetch(`http://127.0.0.1:3001/api/admin/${cedula}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Datos del administrador:', data);
      // Update state or UI with the retrieved admin data
    } else {
      console.error('Administrador no encontrado');
    }
  } catch (error) {
    console.error('Error al obtener los datos del administrador:', error);
  }
};


  useEffect(() => {
    // Cargar candidatos y partidos políticos cuando el contexto se monta
    fetchCandidatos();
    fetchPartidopolitico();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        candidatos,
        votos,
        partidoPoliticos,
        login,
        loginAdmin,
        logout,
        fetchCandidatos,
        fetchPartidopolitico,
        fetchVotantes,
        fetchVotos,
        votarCandidato,
        fetchAdminData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
