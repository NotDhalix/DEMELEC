import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './css/index.css';
import Navbar from './componentes/Navbar';
import BurgerMenu from './componentes/BurgerMenu';

function UserProfile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    fotoPerfil: '',
  });
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null); // Controla el campo que está siendo editado
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Perfil';

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const cedula = user.cedula; // Obtén la cédula desde localStorage

        if (cedula) {
          const fetchUserData = async () => {
            try {
              const response = await fetch(`http://127.0.0.1:3001/api/users/${cedula}`);
              if (response.ok) {
                const data = await response.json();
                setUserData(data);
              } else {
                console.error('Usuario no encontrado');
              }
            } catch (error) {
              console.error('Error en la solicitud:', error);
            } finally {
              setLoading(false);
            }
          };

          fetchUserData();
        } else {
          setLoading(false);
          navigate('/login'); // Si no se encuentra cédula, redirigir al login
        }
      } catch (error) {
        console.error('Error al parsear datos de usuario:', error);
        setLoading(false); // Detener la carga si hay un error al parsear
        navigate('/login'); // Redirigir al login si los datos no se pueden parsear
      }
    } else {
      setLoading(false);
      navigate('/login'); // Si no hay usuario en localStorage, redirigir al login
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUserData((prevData) => ({
        ...prevData,
        fotoPerfil: reader.result,
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const saveField = async (field) => {
    try {
      const updatedData = { [field]: userData[field] };

      if (updatedData[field] && updatedData[field].trim() !== '') {
        const response = await fetch(`http://127.0.0.1:3001/api/users/${userData.cedula}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        });

        if (response.ok) {
          console.log(`El campo ${field} se guardó correctamente.`);
        } else {
          console.error(`Error al guardar el campo ${field}.`);
        }
      } else {
        console.log('El campo no tiene valor o es vacío.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      setEditingField(null);
    }
  };

  if (loading) {
    return <p>Cargando datos del usuario...</p>;
  }

  return (
    
    <div>
      <div>
        <BurgerMenu/>
      </div>
      
      <div>
        <div>
          <Navbar />
        </div>
        <div className="profile-container principal">
        <div className="profile-info">
          <div className="usuario_imagen">
            {userData.fotoPerfil ? (
              <img src={userData.fotoPerfil} alt="Foto de perfil" className="profile-picture" />
            ) : (
              <p>Sin foto de perfil</p>
            )}
            {editingField === 'fotoPerfil' && (
              <input type="file" accept="image/*" onChange={handleFileChange} />
            )}
            {editingField !== 'fotoPerfil' ? (
              <button onClick={() => setEditingField('fotoPerfil')}>Editar Foto</button>
            ) : (
              <button onClick={() => saveField('fotoPerfil')}>Guardar Foto</button>
            )}
          </div>
          <div className="usuario_informacion">
            <FieldEditor
              label="Nombre"
              field="nombre"
              value={userData.nombre}
              editingField={editingField}
              setEditingField={setEditingField}
              handleInputChange={handleInputChange}
              saveField={saveField}
            />
            <FieldEditor
              label="Correo"
              field="correo"
              value={userData.correo}
              editingField={editingField}
              setEditingField={setEditingField}
              handleInputChange={handleInputChange}
              saveField={saveField}
            />
            <FieldEditor
              label="Teléfono"
              field="telefono"
              value={userData.telefono}
              editingField={editingField}
              setEditingField={setEditingField}
              handleInputChange={handleInputChange}
              saveField={saveField}
            />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

const FieldEditor = ({
  label,
  field,
  value,
  editingField,
  setEditingField,
  handleInputChange,
  saveField,
}) => {
  return (
    <div className="field-editor">
      <label>
        {label}:
        {editingField === field ? (
          <input
            type="text"
            name={field}
            value={value}
            onChange={handleInputChange}
          />
        ) : (
          <span>{value || 'Sin información'}</span>
        )}
      </label>
      {editingField !== field ? (
        <button onClick={() => setEditingField(field)}>Editar</button>
      ) : (
        <button onClick={() => saveField(field)}>Guardar</button>
      )}
    </div>
  );
};

export default UserProfile;
