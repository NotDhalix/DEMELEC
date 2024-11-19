import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './componentes/Navbar';
import BurgerMenu from './componentes/BurgerMenu';
import TableWithPagination from './Datos';

function Candidato(){
    return(
        <div>
            <div>
                <BurgerMenu/>
            </div>
            <div>
                <div>
                    <Navbar/>
                </div>
                <div className='principal'>
                    <TableWithPagination/>
                </div>
                
            </div>
        </div>
    );
}
export default Candidato;