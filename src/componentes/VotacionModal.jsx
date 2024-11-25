import React from 'react';
import PropTypes from 'prop-types';

const VotacionModal = ({ isOpen, onClose, candidato, onConfirmar }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirmar Votación</h2>
        <p>¿Estás seguro de que deseas votar por <strong>{candidato.nombre_c +' ' + candidato.apellido_c}</strong>?</p>
        <button onClick={onConfirmar} className="btn-confirmar">
          Confirmar Voto
        </button>
        <button onClick={onClose} className="btn-cancelar">
          Cancelar
        </button>
      </div>
    </div>
  );
};

VotacionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  candidato: PropTypes.object.isRequired,
  onConfirmar: PropTypes.func.isRequired,
};

export default VotacionModal;