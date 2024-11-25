import React, { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './componentes/Navbar';
import VotacionModal from './componentes/VotacionModal';
import PropTypes from 'prop-types';
import BMenu from './componentes/BMenu';

function Votacion() {
  const {
    fetchCandidatos,
    candidatos,
    votarCandidato,
    verificarVotacion,
    registrarVotacion,
  } = useAuth();

  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState(null);
  const [error, setError] = useState('');
  const [confirmacionAbierta, setConfirmacionAbierta] = useState(false);
  const [cedulaUsuario, setCedulaUsuario] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carga de candidatos
  const [votando, setVotando] = useState(false); // Estado de carga para votación

  // Recupera la cédula del localStorage al montar el componente
  useEffect(() => {
    const storedCedula = localStorage.getItem('cedulaUsuario');
    if (storedCedula) {
      setCedulaUsuario(storedCedula);
    } else {
      console.error('No se encontró la cédula en el localStorage.');
    }
  }, []);

  // Efecto para cargar candidatos al inicio
  useEffect(() => {
    const fetchData = async () => {
      if (!candidatos || candidatos.length === 0) {
        setLoading(true); // Set loading to true while fetching
        try {
          await fetchCandidatos();
        } catch (err) {
          setError('Error al cargar los datos. Por favor, recarga la página.');
          console.error(err);
        } finally {
          setLoading(false); // Set loading to false once fetch completes
        }
      }
    };

    fetchData();
  }, [candidatos, fetchCandidatos]);

  // Función para manejar la votación
  const handleVotacion = async (candidato) => {
    const yaVoto = verificarVotacion(cedulaUsuario);
      if (yaVoto && yaVoto.votacion_realizada) {
        alert('Ya has votado. No puedes votar nuevamente.');
      } else {
        
        setCandidatoSeleccionado(candidato);
        setConfirmacionAbierta(true); // Abre el modal de confirmación
        alert('N has votado. No puedes votar nuevamente.');
      }
  };

  // Función para confirmar la votación y registrar el voto
  const confirmarVotacion = async () => {
    votarCandidato(candidatoSeleccionado.id_candidato);
       registrarVotacion(cedulaUsuario);
        alert('Voto registrado con éxito');

        // Limpia la selección y cierra el modal
        setCandidatoSeleccionado(null);
        setConfirmacionAbierta(false);
  };

  return (
    <div className="principal centrear">
      <BMenu />
      <div className="contenido">
        <Navbar />
        <div className="principal">
          {error && <p className="error-message">{error}</p>}
          {loading ? (
            <p>Cargando candidatos...</p> // Muestra mensaje de carga
          ) : votando ? (
            <p>Registrando tu voto...</p> // Muestra mensaje de votación
          ) : (
            <CandidatosCards candidatos={candidatos} onVotar={handleVotacion} />
          )}
        </div>
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
  votarCandidato: PropTypes.func,
  verificarVotacion: PropTypes.func,
  registrarVotacion: PropTypes.func,
};

const CandidatosCards = ({ candidatos, onVotar }) => {
  if (!candidatos || candidatos.length === 0) {
    return <p>No hay candidatos disponibles.</p>;
  }

  return (
    <div className="cards-container">
      {candidatos.map((candidato) => (
        <div className="card" key={candidato.id_candidato}> {/* Usando id_candidato como key única */}
          <img
            src={candidato.imagen || 'https://via.placeholder.com/150'}
            alt={candidato.nombre_c} // Texto alternativo para la imagen
          />
          <div className="card-content">
            <h3>{candidato.nombre_c}</h3>
            <p>Partido: {candidato.nombre_pp}</p>
            <button onClick={() => onVotar(candidato)}>Votar</button>
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
