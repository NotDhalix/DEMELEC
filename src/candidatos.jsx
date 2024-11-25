import React, { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext'; // Importa el contexto
import Navbar from './componentes/Navbar';
import { useNavigate } from 'react-router-dom';
import BurgerMenu from './componentes/BurgerMenu';
import PropTypes from 'prop-types';

function Candidato() {
  const { fetchCandidatos, candidatos } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Efecto para cargar candidatos
  useEffect(() => {
    const fetchData = async () => {
      if (!candidatos || candidatos.length === 0) { // Verifica si ya hay datos
        try {
          await fetchCandidatos(); // Solo llama a la API si no hay datos cargados
        } catch (err) {
          setError('Error al cargar los datos. Por favor, recarga la página.');
          console.error(err);
        }
      }
    };

    fetchData();
  }, [candidatos, fetchCandidatos]);

  if (!candidatos) {
    return <p>Cargando candidatos...</p>;
  }

  return (
    <div className="principal">
      <div>
        <BurgerMenu navigate={navigate} />
      </div>
      <div className="contenido">
        <div className="na">
          <Navbar />
        </div>
        <div className="principal">
          {error && <p className="error-message">{error}</p>}
          <CandidatosTable candidatos={candidatos} />
        </div>
      </div>
    </div>
  );
}

Candidato.propTypes = {
  fetchCandidatos: PropTypes.func,
  candidatos: PropTypes.array,
  agregarCandidato: PropTypes.func,
  actualizarCandidato: PropTypes.func,
};

const CandidatosTable = ({ candidatos }) => {
  if (!candidatos || candidatos.length === 0) {
    return (
      <div style={{ textAlign: 'center' }}>
        <p>No hay candidatos disponibles.</p>
      </div>
    );
  }

  return (
    <table className="tabla-candidatos">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Cédula</th>
          <th>Partido</th>
          <th>Acciones</th> {/* Nueva columna para las acciones */}
        </tr>
      </thead>
      <tbody>
        {candidatos.map((candidato, index) => (
          <tr key={index}>
            <td className='fila'>{candidato.nombre_c +'  '+ candidato.apellido_c || 'Sin nombre'}</td>
            <td>{candidato.cedula_c || 'Sin cédula'}</td>
            <td>{candidato.nombre_pp || 'Sin nombre'}</td>
            <td>
              <button
                onClick={() => handleEdit(candidato)}
                className="edit-button"
              >
                Editar
              </button>
            </td> {/* Botón para editar */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

CandidatosTable.propTypes = {
  candidatos: PropTypes.array.isRequired,
};

// Función de edición
const handleEdit = (candidato) => {
  alert(`Editar datos de: ${candidato.nombre_c} ${candidato.apellido_c}`);
  // Aquí puedes navegar a una página de edición o abrir un formulario modal
};

export default Candidato;
