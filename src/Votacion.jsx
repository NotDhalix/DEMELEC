import React, { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext'; // Importa el contexto
import Navbar from './componentes/Navbar';
import VotacionModal from './componentes/VotacionModal'; // Importa el VotacionModal
import PropTypes from 'prop-types';

function Votacion() {
  const {
    fetchCandidatos,
    candidatos,
    votarCandidato,
  } = useAuth();

  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState(null);
  const [error, setError] = useState('');
  const [confirmacionAbierta, setConfirmacionAbierta] = useState(false);

  // Efecto para cargar candidatos y partidos
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

  // Función para manejar la votación
  const handleVotacion = (candidato) => {
    console.log('Candidato seleccionado:', candidato);  // Verifica que el candidato tenga id_candidato
    setCandidatoSeleccionado(candidato);
    setConfirmacionAbierta(true);
  };

  // Función para confirmar la votación y actualizar la base de datos
  const confirmarVotacion = async () => {
    if (!candidatoSeleccionado || !candidatoSeleccionado.id_candidato) {
      setError('Candidato no seleccionado o inválido.');
      console.log('Candidato no válido:', candidatoSeleccionado);
      return;
    }
    try {
      await votarCandidato(candidatoSeleccionado.id_candidato); // Usa id_candidato en lugar de id
      setConfirmacionAbierta(false);
      setCandidatoSeleccionado(null);
      alert('Voto registrado con éxito');
    } catch (error) {
      setError('Error al registrar el voto. Inténtalo nuevamente.');
      console.error(error);
    }
  };

  return (
    <div className="principal centrear">
      <div className="contenido">
        <div className="na">
          <Navbar />
        </div>
        <div className="principal">
          {error && <p className="error-message">{error}</p>}
          <CandidatosCards
            candidatos={candidatos}
            onVotar={handleVotacion}
          />
        </div>
        {/* Modal de confirmación de votación */}
        {confirmacionAbierta && candidatoSeleccionado && (
          <VotacionModal
            isOpen={confirmacionAbierta}
            onClose={() => setConfirmacionAbierta(false)}
            candidato={candidatoSeleccionado}
            onConfirmar={confirmarVotacion}
          />
        )}
      </div>
    </div>
  );
}

Votacion.propTypes = {
  fetchCandidatos: PropTypes.func,
  candidatos: PropTypes.array,
  agregarCandidato: PropTypes.func,
  actualizarCandidato: PropTypes.func,
  fetchPartidopolitico: PropTypes.func,
  Nombre_pp: PropTypes.func,
  votarCandidato: PropTypes.func,
};

const CandidatosCards = ({ candidatos, onVotar }) => {
  if (!candidatos || candidatos.length === 0) {
    return (
      <div style={{ textAlign: 'center' }}>
        <p>No hay candidatos disponibles.</p>
      </div>
    );
  }

  return (
    <div className="cards-container">
      {candidatos.map((candidato, index) => (
        <div className="card" key={index}>
          <img
            src={candidato.imagen || 'https://via.placeholder.com/150'}
            alt={`Imagen de ${candidato.nombre_c}`}
            className="card-image"
          />
          <div className="card-content">
            <h3 className="card-title">{candidato.nombre_c || 'Sin nombre'}</h3>
            <p className="card-position">{candidato.apellido_c || 'Sin apellido'}</p>
            <p className="card-partido">
              Partido: {candidato.nombre_pp || 'Cargando partido...'}
            </p>
            <p className="card-cedula">{candidato.cedula_c || 'Sin cédula'}</p>
            <button
              onClick={() => onVotar(candidato)} // Llama a onVotar para abrir el modal de votación
              className="btn-votar"
            >
              Votar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

CandidatosCards.propTypes = {
  candidatos: PropTypes.array,
  onVotar: PropTypes.func,
};

export default Votacion;
