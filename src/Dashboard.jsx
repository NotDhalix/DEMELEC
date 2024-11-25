import React, { useEffect } from 'react'; // Asegúrate de importar useEffect
import BarChart from './components/BarChart';
import PreliminarWinner from './components/PreliminarWinner';
import BurgerMenu from './componentes/BurgerMenu';
import Navbar from './componentes/Navbar';
function Dashboard() {
  useEffect(() => {
    document.title = 'Dashboard'; // Actualiza el título del documento al cargar el componente
  }, []); // El array vacío asegura que solo se ejecute una vez

  return (
    <div className="principal">
      <div className=""> 
        <BurgerMenu />
      </div>
      <div className=''>
        <div className='na'><Navbar /></div>
        <div className='content'>
          <BarChart />
          <PreliminarWinner />
        </div>
      </div>
      
    </div>
  );
}

export default Dashboard;