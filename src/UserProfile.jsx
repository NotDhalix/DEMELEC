import React, { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';

function UserProfile() {
  const { user } = useAuth(); // Accede al estado del usuario
  const [userData, setUserData] = useState(null); // Estado para almacenar los datos del usuario
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica si la cédula del usuario está disponible
    if (user && user.cedula) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:3001/api/users/${user.cedula}`);
          
          if (response.ok) {
            const data = await response.json();
            setUserData(data); // Almacena los datos obtenidos en el estado
          } else {
            console.error('Error al obtener datos del usuario');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
      setLoading(false); // Finaliza la carga si no hay cédula en el usuario
    }
  }, [user]);

  if (loading) {
    return <p>Cargando datos del usuario...</p>;
  }

  if (!userData) {
    return <p>No se encontraron datos del usuario.</p>;
  }

  return (
    <div className="profile-container">
      <h2>Perfil del Usuario</h2>
      <div className="profile-info">
        <p><strong>Nombre:</strong> {userData.nombre_v || "No especificado"}</p>
        <p><strong>Email:</strong> {userData.correo || "No especificado"}</p>
        <p><strong>Rol:</strong> {userData.rol || "No especificado"}</p>
        {/* Agrega más datos si están disponibles en userData */}
      </div>
    </div>
  );
}

export default UserProfile;
