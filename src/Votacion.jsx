import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function VotacionPage() {
  const [candidatos, setCandidatos] = useState([]);
  const [selectedCandidato, setSelectedCandidato] = useState(null);
  const [loading, setLoading] = useState(false); // State to handle loading
  const [loadingVote, setLoadingVote] = useState(false); // State to handle voting loading
  const navigate = useNavigate();

  // Cargar los candidatos desde el servidor cuando el componente se monta
  useEffect(() => {
  async function fetchCandidatos() {
    try {
      const response = await fetch('http://127.0.0.1:3001/api/candidatos');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data); // Handle your data here
    } catch (error) {
      console.error('Error al obtener los candidatos:', error);
    }
  }

  fetchCandidatos();
}, []);


  // Función para manejar el voto
  const handleVotar = async () => {
    if (!selectedCandidato) {
      alert('Por favor, selecciona un candidato para votar.');
      return;
    }

    setLoadingVote(true); // Set loading to true while voting

    try {
      const response = await fetch('http://127.0.0.1:3001/api/votar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ candidatoId: selectedCandidato }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Voto registrado con éxito.');
        navigate('/resultado'); // Redirigir a la página de resultados
      } else {
        alert('Error al registrar el voto: ' + data.error);
      }
    } catch (error) {
      console.error('Error al registrar el voto:', error);
      alert('Hubo un error al registrar el voto.');
    } finally {
      setLoadingVote(false); // Set loading to false after voting attempt
    }
  };

  return (
    <div className="votacion-page">
      <h1>Votación</h1>
      <p>Selecciona un candidato para votar:</p>

      <div className="candidatos-list">
        {loading ? (
          <p>Cargando candidatos...</p>
        ) : (
          candidatos.length > 0 ? (
            candidatos.map((candidato) => (
              <div key={candidato.id} className="candidato">
                <input
                  type="radio"
                  id={`candidato-${candidato.id}`}
                  name="candidato"
                  value={candidato.id}
                  onChange={() => setSelectedCandidato(candidato.id)}
                />
                <label htmlFor={`candidato-${candidato.id}`}>
                  {candidato.nombre} ({candidato.partido})
                </label>
              </div>
            ))
          ) : (
            <p>No se encontraron candidatos.</p>
          )
        )}
      </div>

      <button onClick={handleVotar} className="votar-button" disabled={loadingVote}>
        {loadingVote ? 'Registrando voto...' : 'Votar'}
      </button>
    </div>
  );
}

export default VotacionPage;
