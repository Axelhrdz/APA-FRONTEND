import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { DataGrid } from 'react-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-regular-svg-icons';


const PadronOld = () => {

  const [padronData, setPadronData] = useState([]);

  //DATA GRID SECTION
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const getPadronData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/padrones/padron-old`);
      const raw = res.data.padrones;
      const list = Array.isArray(raw) ? raw : raw && typeof raw === 'object' ? Object.values(raw) : [];

      setPadronData(list);

      if (list.length === 0) {
        setColumns([]);
        setRows([]);
        return;
      }

      const first = list[0];
      setColumns(Object.keys(first).map((key) => ({ key, name: key })));
      setRows(
        list.map((item, index) => ({
          id: item.id ?? item._id ?? index,
          ...item,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getPadronData();
  }, []);

  return (
    <div>
      <h1 className='text-2xl font-bold'>Padron - ultimo respaldo - 12 de Marzo de 2026</h1>


      <div className='flex flex-col gap-4 border-1 border-stone-300 rounded-md p-4 m-5'>
        {
          padronData.length > 0 ? (
            <DataGrid className='rdg-light' columns={columns} rows={rows} />
          ) : (
            <div className='flex flex-col gap-2 items-center justify-center w-full h-full'>
              <FontAwesomeIcon className='text-stone-500 text-3xl' icon={faFile} />
              <span className='text-sm text-stone-500'>Sin datos</span>
              <span className='text-sm text-stone-500'>Sube un archivo Excel, y da click en "Ver previsualizacion" para ver el contenido del archivo</span>
            </div>
          )

        }
      </div>
    </div>
  )
}

export default PadronOld
