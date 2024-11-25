import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Importa el contexto
import Chart from "react-apexcharts";
import PropTypes from 'prop-types';

function BarChart() {
  const { votos, error, fetchVotos } = useAuth();  // Usamos votos del contexto
  const [seriesData, setSeriesData] = useState([]);  // Inicializar con arreglo vacío
  const [categories, setCategories] = useState([]);  // Para las categorías (nombres de los candidatos)
  const [loading, setLoading] = useState(true);  // Controla la carga de datos

  // Efecto para cargar los datos del gráfico
  useEffect(() => {
    const fetchData = async () => {
      if (votos && votos.length === 0) { // Verifica si no hay votos
        try {
          await fetchVotos(); // Llama a la API para obtener los votos si no hay datos
        } catch (err) {
          console.error('Error al cargar los votos:', err);
        }
      }
    };

    fetchData();
  }, [votos, fetchVotos]);

  // Efecto para actualizar los votos y cambiar el estado de carga
  useEffect(() => {
    if (votos && votos.length > 0) {
      console.log('Datos de votos:', votos);

      // Procesamos las categorías y los datos de los votos
      const candidateNames = votos.map(voto => voto.nombre_c);  // Obtener nombres de los candidatos
      const votes = votos.map(voto => voto.cantidad_votos);  // Obtener cantidad de votos

      setCategories(candidateNames);  // Actualizar categorías con los nombres de los candidatos
      setSeriesData(votes);  // Actualizar los datos del gráfico
      setLoading(false);  // Ya no está cargando
    } else if (votos.length === 0) {
      setSeriesData([0]);  // Si no hay votos, asignar 0 como predeterminado
      setCategories(['Sin datos']);  // Poner 'Sin datos' como categoría
      setLoading(false);  // Ya no está cargando
    }
  }, [votos]); // Este useEffect se ejecuta cada vez que cambia votos

  // Si todavía está cargando, muestra el mensaje de carga
  if (loading) {
    return <p>Cargando votos...</p>;
  }

  // Si hay error, muestra el mensaje de error
  if (error) {
    return <p>{error}</p>;
  }

  // Si hay votos, continúa con el gráfico
  const maxValue = Math.max(...seriesData);
  const maxValueIndex = seriesData.indexOf(maxValue);
  const colors = seriesData.map(value => (value === maxValue ? '#F00' : '#FFF'));  // Resaltar el máximo en rojo

  const isMobile = window.innerWidth <= 768;
  const chartWidth = isMobile ? 380 : 900;
  const chartHeight = isMobile ? 380 : 250;

  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: !isMobile,
        distributed: true,
        barHeight: isMobile ? '100%' : '70%', 
        columnWidth: isMobile ? '60%' : '70%',
      }
    },
    dataLabels: {
      enabled: true,
      style: { colors: '#000' }
    },
    xaxis: {
      categories: categories.length > 0 ? categories : ['Sin datos'],  // Usamos 'categories' aquí
      labels: { style: { colors: '#FFF' }, show: !isMobile }
    },
    yaxis: {
      labels: {
        style: { colors: '#FFF', fontSize: isMobile ? '12px' : '16px' },
        show: !isMobile
      }
    },
    grid: { borderColor: 'none' },
    colors: colors,
    tooltip: { enabled: false },
    legend: {
      show: isMobile,
      horizontalAlign: 'center', 
      verticalAlign: 'bottom', 
      itemMargin: { horizontal: 20, vertical: 5 },
      labels: { colors: '#FFF', fontSize: '20px' }
    }
  };

  return (
    <div className="bar-plot">
      <div className="row">
        <div className="mixed-chart">
          <Chart
            options={chartOptions}
            series={[{ data: seriesData }]}
            width={chartWidth}
            height={chartHeight}
            type="bar"
          />
        </div>
      </div>
    </div>
  );
}

BarChart.propTypes = {
  votos: PropTypes.array,  // Solo necesitamos votos
};

export default BarChart;
