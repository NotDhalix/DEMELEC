import React, { useState, useEffect } from 'react';

function ModalCandidato({ isOpen, onClose, onSave, candidato }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    partidoPolitico: '',
    edad: '',
  });

  // Rellenar el formulario si estamos editando
  useEffect(() => {
    if (candidato) {
      setFormData({
        nombre: candidato.nombre || '',
        apellido: candidato.apellido || '',
        partidoPolitico: candidato.partidoPolitico || '',
        edad: candidato.edad || '',
      });
    }
  }, [candidato]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Llama a la función para guardar los datos
    onClose(); // Cierra el modal
  };

  if (!isOpen) return null; // No renderizar nada si el modal está cerrado

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{candidato ? 'Editar Candidato' : 'Agregar Candidato'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Apellido:
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Partido Político:
            <input
              type="text"
              name="partidoPolitico"
              value={formData.partidoPolitico}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Edad:
            <input
              type="number"
              name="edad"
              value={formData.edad}
              onChange={handleChange}
              required
            />
          </label>
          <div className="modal-buttons">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit">
              {candidato ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalCandidato;
