import React, { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext'; // Importa el contexto
import Navbar from './componentes/Navbar';
import BurgerMenu from './componentes/BurgerMenu';
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
    setCandidatoSeleccionado(candidato); // Establece el candidato seleccionado
    setConfirmacionAbierta(true); // Abre el modal de confirmación
  };

  // Función para confirmar la votación y actualizar la base de datos
  const confirmarVotacion = async () => {
    try {
      await votarCandidato(candidatoSeleccionado.id); // Llama a la función para votar
      setConfirmacionAbierta(false); // Cierra el modal
      setCandidatoSeleccionado(null); // Limpia la selección
      alert('Voto registrado con éxito');
    } catch (error) {
      setError('Error al registrar el voto. Inténtalo nuevamente.');
      console.error(error);
    }
  };

  return (
    <div className="principal">
      <div>
        <BurgerMenu />
      </div>
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
            onClose={() => setConfirmacionAbierta(false)} // Cierra el modal
            candidato={candidatoSeleccionado} // Pasa el candidato seleccionado al modal
            onConfirmar={confirmarVotacion} // Llama a la función de confirmación
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
  Nombre_pp: PropTypes.func, // Función requerida
  votarCandidato: PropTypes.func, // Función para votar
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
            alt={`Imagen de ${candidato.nombre_c}`} // Corregido
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
  partidos: PropTypes.object, // Objeto de partidos requerido
};

export default Votacion;
