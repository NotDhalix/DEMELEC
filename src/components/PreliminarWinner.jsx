import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Importa el contexto

function PreliminarWinner() {
    const { votos, fetchVotos } = useAuth(); // Usa los votos del contexto
    const [winner, setWinner] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (votos && votos.length === 0) {
                try {
                    await fetchVotos(); // Llama al endpoint si no hay datos cargados
                } catch (err) {
                    console.error('Error al cargar los votos:', err);
                }
            }
        };

        fetchData();
    }, [votos, fetchVotos]);

    useEffect(() => {
        if (votos && votos.length > 0) {
            // Encuentra el candidato con la mayor cantidad de votos
            const preliminarWinner = votos.reduce((max, candidato) =>
                candidato.cantidad_votos > max.cantidad_votos ? candidato : max, votos[0]
            );
            setWinner(preliminarWinner);
            setLoading(false);
        } else if (votos.length === 0) {
            setWinner(null); // Si no hay datos, no hay ganador
            setLoading(false);
        }
    }, [votos]);

    if (loading) {
        return <p>Cargando datos del ganador preliminar...</p>;
    }

    if (!winner) {
        return <p>No se encontraron datos para determinar un ganador.</p>;
    }

    return (
        <div className="preliminar-winner-card">
            <label className="preliminar-winner-label">GANADOR PRELIMINAR</label>
            <img
                className="preliminar-winner-pic"
                src={winner.image || "https://via.placeholder.com/150"}
                alt={`Foto de ${winner.nombre_c} ${winner.apellido_c}`}
            />
            <span className="preliminar-winner-name">
                {`${winner.nombre_c} ${winner.apellido_c}`}
            </span>
            <span className="preliminar-winner-votes">
                {`Votos: ${winner.cantidad_votos}`}
            </span>
        </div>
    );
}

export default PreliminarWinner;
