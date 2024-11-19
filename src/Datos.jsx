import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TableWithPagination = ({ rowsPerPage, endpoints }) => {
  const location = useLocation(); // Obtén la ruta actual
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determina el endpoint basado en la página actual
  const currentEndpoint = endpoints[location.pathname] || endpoints.default;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(currentEndpoint);
        const contentType = response.headers.get('Content-Type');
        if (!response.ok || !contentType.includes('application/json')) {
          throw new Error('La respuesta no es JSON válido.');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentEndpoint]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="page-container">
      <main>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                {data.length > 0 &&
                  Object.keys(data[0]).map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TableWithPagination;
