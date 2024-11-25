import React, { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext'; // Importa el contexto
import PropTypes from 'prop-types';

function PartidosPoliticos() {
  const { fetchPartidopolitico, partidos } = useAuth();
  const [error, setError] = useState('');

  // Efecto para cargar partidos políticos
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchPartidopolitico();
      } catch (err) {
        setError('Error al cargar los partidos políticos. Por favor, recarga la página.');
        console.error(err);
      }
    };

    fetchData();
  }, [fetchPartidopolitico]);

  if (!partidos) {
    return <p>Cargando partidos políticos...</p>;
  }

  return (
    <div className="partidos-container">
      {error && <p className="error-message">{error}</p>}
      <PartidosTable partidos={partidos} />
    </div>
  );
}

const PartidosTable = ({ partidos }) => {
  if (!partidos || partidos.length === 0) {
    return (
      <div style={{ textAlign: 'center' }}>
        <p>No hay partidos políticos disponibles.</p>
      </div>
    );
  }

  return (
    <table className="tabla-partidos">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre del Partido</th>
        </tr>
      </thead>
      <tbody>
        {partidos.map((partido, index) => (
          <tr key={index}>
            <td>{partido.id_pp}</td>
            <td>{partido.nombre_pp || 'Sin nombre'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

PartidosTable.propTypes = {
  partidos: PropTypes.array.isRequired,
};

export default PartidosPoliticos;
