import React from 'react';
import PropTypes from 'prop-types';

const CandidatosCards = ({ candidatos, onVotar, partidos }) => {
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
              Partido: {partidos[candidato.id_pp] || 'Cargando partido...'}
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
  candidatos: PropTypes.array.isRequired,
  onVotar: PropTypes.func.isRequired,
  partidos: PropTypes.object.isRequired, // Asegúrate de que esto sea requerido
};

export default CandidatosCards;