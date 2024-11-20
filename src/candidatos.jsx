import React, { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './componentes/Navbar';
import BurgerMenu from './componentes/BurgerMenu';
import ModalCandidato from './componentes/Candidato_ae';

function Candidato() {
  const { fetchCandidatos, candidatos, agregarCandidato, actualizarCandidato } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState(null);

  useEffect(() => {
    fetchCandidatos(); // Llama a la función para obtener los datos
  }, [fetchCandidatos]);

  const handleAgregar = () => {
    setCandidatoSeleccionado(null); // Nuevo candidato
    setModalOpen(true);
  };

  const handleEditar = (candidato) => {
    setCandidatoSeleccionado(candidato); // Candidato existente
    setModalOpen(true);
  };

  const handleSave = (formData) => {
    if (candidatoSeleccionado) {
      // Editar candidato existente
      actualizarCandidato(candidatoSeleccionado.id, formData);
    } else {
      // Agregar nuevo candidato
      agregarCandidato(formData);
    }
    fetchCandidatos(); // Actualizar la lista
  };

  return (
    <div className="container">
      <div className="nav"> 
        <Navbar />
      </div>
      <div>
        <div className="lateral">
          <BurgerMenu />
        </div>
        <div className="principal">
          <table className="tabla-candidatos">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Partido Político</th>
                <th>Edad</th>
                <th>
                  <button onClick={handleAgregar} className="btn-agregar">
                    Agregar
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {candidatos && candidatos.length > 0 ? (
                candidatos.map((candidato, index) => (
                  <tr key={index}>
                    <td>{candidato.nombre}</td>
                    <td>{candidato.apellido}</td>
                    <td>{candidato.partidoPolitico}</td>
                    <td>{candidato.edad} años</td>
                    <td>
                      <button 
                        onClick={() => handleEditar(candidato)} 
                        className="btn-editar"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    No hay candidatos disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ModalCandidato
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        candidato={candidatoSeleccionado}
      />
    </div>
  );
}

export default Candidato;
