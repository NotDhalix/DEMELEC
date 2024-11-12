import React, { useEffect } from 'react'; // Asegúrate de importar useEffect
import BarChart from './components/BarChart';
import PreliminarWinner from './components/PreliminarWinner';
import BurgerMenu from './BurgerMenu';

function Dashboard() {
  useEffect(() => {
    document.title = 'Dashboard'; // Actualiza el título del documento al cargar el componente
  }, []); // El array vacío asegura que solo se ejecute una vez

  return (
    <div className="dashboard">
      <BurgerMenu />
      <BarChart />
      <PreliminarWinner />
    </div>
  );
}

export default Dashboard;