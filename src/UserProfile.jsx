import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './css/index.css';
import Navbar from './componentes/Navbar';
import BurgerMenu from './componentes/BurgerMenu';
import PropTypes from 'prop-types';

function UserProfile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null); // Inicializamos userData en null
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const cedula = user.cedula;

        if (cedula) {
          const fetchUserData = async () => {
            try {
              const response = await fetch(`http://127.0.0.1:3001/api/users/${cedula}`);
              if (response.ok) {
                const data = await response.json();
                setUserData(data);
              } else {
                setError('Usuario no encontrado');
              }
            } catch (error) {
              setError('Error al cargar los datos del usuario');
            } finally {
              setLoading(false);
            }
          };

          fetchUserData();
        } else {
          setLoading(false);
          navigate('/login');
        }
      } catch (error) {
        setError('Error al parsear datos del usuario');
        setLoading(false);
        navigate('/login');
      }
    } else {
      setLoading(false);
      navigate('/login');
    }
  }, [navigate]);

  // Verificamos si estamos cargando o si hay algún error
  if (loading) {
    return <p>Cargando datos del usuario...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="principal">
      <div>
        <BurgerMenu />
      </div>
      <div className='contenido'>
        <Navbar />
        <div className="profile-container principal">
          <div className="profile-info">
            <div className="usuario_imagen">
              {/* Verificamos si userData existe antes de acceder a sus propiedades */}
              <img
                src={userData?.fotoPerfil || 'https://via.placeholder.com/150'}
                alt={`Foto de perfil de ${userData?.nombre || 'Usuario'}`}
                className="profile-image"
              />
            </div>

            <div className="usuario_informacion">
              <FieldEditor label="Nombre" value={userData?.nombre_admin+' '+userData?.apellido_admin || 'Sin nombre'} />
              <FieldEditor label="Correo" value={userData?.correo_admin || 'Sin correo'} />
              <FieldEditor label="Teléfono" value={userData?.telefono_admin || 'Sin teléfono'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const FieldEditor = ({ label, value }) => (
  <div className="field-editor">
    <label>
      {label}: <span>{value || 'Sin información'}</span>
    </label>
  </div>
);

FieldEditor.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

FieldEditor.defaultProps = {
  value: 'Sin información', // Proporcionamos un valor por defecto en caso de que el valor sea undefined o null
};

export default UserProfile;
