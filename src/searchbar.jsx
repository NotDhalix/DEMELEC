import React, { useState } from 'react';

const SearchBar = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

  // Filtrar los datos según el término de búsqueda
  const filteredData = data.filter((item) =>
    item.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por sección..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el término de búsqueda
        style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
      />

      {/* Renderizar los datos filtrados */}
      <ul>
        {filteredData.map((item, index) => (
          <li key={index}>
            <strong>Sección:</strong> {item.section} <br />
            <strong>Contenido:</strong> {item.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
