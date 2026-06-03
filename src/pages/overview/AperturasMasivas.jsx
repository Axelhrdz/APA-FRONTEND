import React from 'react'
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { DataGrid } from 'react-data-grid';

//UI components imports
import InputCompact from '../../components/ui/InputCompact';
import SelectCompact from '../../components/ui/SelectCompact';
import InputLabel from '../../components/ui/InputLabel';
import ButtonPrimary from '../../components/ui/ButtonPrimary';





const AperturasMasivas = () => {

  const timeoutRef = useRef(null);
  const [previewData, setPreviewData] = useState(null);
  console.log('previewData', previewData);

  const [previewVisible, setPreviewVisible] = useState(false);
  console.log('previewVisible', previewVisible);

  const [confirmPreview, setConfirmPreview] = useState(false);
  console.log('confirmPreview', confirmPreview);

  //DATA GRID SECTION
  const [columns, setColumns] = useState([]);
  console.log('columns', columns);

  const [rows, setRows] = useState([]);
  console.log('rows', rows);

  
  // const [tipoPredio, setTipoPredio] = useState('null');
  const [localidad, setLocalidad] = useState('');
  const [colonia, setColonia] = useState('');
  // const [statusCode, setStatusCode] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  //Cleanup: cancel pending timeout on component unmount
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);


  const formRef = useRef(null);






  const handlePreview = async (e) => {
    console.log('desde handlePreview');


    //get form data
    const formData = new FormData(formRef.current);
    const formValues = Object.fromEntries(formData);
    console.log(formValues.file);

    setConfirmPreview(false);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/preview-excel/preview`, formData);
      console.log(res.data);
      const gridData = res.data.jsonData;
      setPreviewData(res.data);
      setPreviewVisible(true);


      const columns = Object.keys(gridData.jsonData[0]).map((key) => {
        return { key, name: key };
      });
      setColumns(columns);

      const rows = gridData.jsonData.map((item) => { return { id: item.id, ...item } });
      setRows(rows);

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }



  const handleConfirmPreview = async (e) => {
    e.preventDefault();
    setConfirmPreview(true);
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirmPreview) return;

    console.log('from handleSubmit');
    setIsLoading(true);
  
    //getting form data
    const formData = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formData);
    console.log(formValues);  //here getting the file value and the other values 
  
  
    try {
      const res = await axios.post(
        // 'https://apa-backend-2g9k.onrender.com/aperturas_masivas/apertura', formData,
        `${import.meta.env.VITE_API_BASE_URL}/aperturas_masivas/apertura`, formData,
        {
          // responseType: 'blob',
          responseType: 'json',
        }
      );
  
      
      
      clearTimeout(timeoutRef.current);
      setFeedback({
        type: 'success',
        message: 'Apertura masiva enviada correctamente',
        statusCode: res?.data?.status || null
      })
      timeoutRef.current = setTimeout(() => {
        setFeedback(null);
      }, 4000);


    
      console.log(res?.data?.status)

      
      return res.data;
    } catch (error) {
      console.log(error);
      
      if(error.response){
        clearTimeout(timeoutRef.current);
        setFeedback({
          type: 'error',
          message: 'Error al enviar la apertura masiva',
          statusCode: error.response?.data?.status || null
        })
        timeoutRef.current = setTimeout(() => {
          setFeedback(null);
        }, 4000);

        console.log(error.response?.data?.status);
        
      } else {
        // setStatusCode('NETWORK_ERROR');
        setFeedback({
          type: 'error',
          message: 'No se pudo conectar con el servidor',
          statusCode: null
        });
      }
      // console.log(statusCode);
      console.error('Error during fetching operation:', error);
      
    } finally {
      setIsLoading(false);
    }
  };


  const handleChangeLocalidad = (e) => {
    setLocalidad(e.target.value.toUpperCase());
  }

  const handleChangeColonia = (e) => {
    setColonia(e.target.value.toUpperCase());
  }

  
  return (
    <div className='flex flex-col lg:flex-row w-full min-h-[calc(100dvh-64px)] lg:h-[calc(100dvh-64px)] lg:overflow-hidden'>
      <div className='flex flex-col min-h-0 w-full lg:w-80 lg:max-w-xs lg:flex-shrink-0 lg:h-full bg-[#fff] text-black border-b lg:border-b-0 border-r-0 lg:border-r-1 border-stone-300'>

        {
          feedback?.type === 'success' ?
            <div className='shrink-0 text-center text-base sm:text-2xl font-thin py-3 sm:py-5 px-2 bg-green-500 text-white'>
              {/* <h1>Status Code: {feedback.statusCode}</h1> */}
              <span>{feedback.message}</span>
            </div>
          : null
        }
        {
          feedback?.type === 'error' ?
            <div className='shrink-0 text-center text-base sm:text-2xl font-thin py-3 sm:py-5 px-2 bg-red-500 text-white'>
              {/* <h1>Status Code: {feedback.statusCode}</h1> */}
              <span>{feedback.message}</span>
            </div>
          : null
        }


        <div className='shrink-0 p-4 sm:p-5 text-center border-b-1 border-stone-300'>
            <h1 className='text-xl sm:text-2xl font-thin'>Aperturas Masivas</h1>
        </div>
        {/* <span className=''>This is the aperturas masivas page</span> */}
        

        <form ref={formRef} encType='multipart/form-data' action="" onSubmit={handleSubmit} className='flex flex-col gap-4 bg-stone_700 text-black p-4 w-full max-w-md mx-auto lg:max-w-none lg:mx-0 flex-1 lg:min-h-0 lg:overflow-y-auto'>

          <div className='flex flex-col gap-2'>
            <InputLabel
              htmlFor='folio'
              label='Folio / nombre del archivo'
            />
            <InputCompact
              type='text'
              name='folio'
              id='folio'
              required
              placeholder={'folio / nombre del archivo'}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <InputLabel
              htmlFor='localidad'
              label='Localidad'
            />
            <InputCompact
              type='text'
              name='localidad'
              id='localidad'
              required
              placeholder={'localidad'}
              onChange={handleChangeLocalidad}
              value={localidad}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <InputLabel
              htmlFor='colonia'
              label='colonia'
            />
            <InputCompact
              type='text'
              name='colonia'
              id='colonia'
              required
              placeholder={'colonia'}
              onChange={handleChangeColonia}
              value={colonia}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <InputLabel
              htmlFor='file'
              label=''
            />
            <InputCompact
              type='file'
              name='file'
              id='file'
              required
            />
          </div>
          <div className='flex flex-col gap-2'>
            <InputLabel
              htmlFor='tipo_servicio'
              label='Tipo de predio'
            />
            <SelectCompact
              name='tipo_servicio'
              id='tipo_servicio'
              required
            >
              <option value="">Seleccione...</option>
              <option value="H">Habitacional</option>
              <option value="C">Comercial</option>
              <option value="I">Industrial</option>
              <option value="E">Uso de Gobierno</option>
            </SelectCompact>
          </div>
          <div className='flex flex-col gap-2'>
            <InputLabel
              htmlFor='conexiones'
              label='Conexiones'
            />
            <SelectCompact
              name='conexiones'
              id='conexiones'
              required
            >
              <option value="">Seleccione...</option>
              <option value="1">1. Ninguna</option>
              <option value="2">2. Conexion Agua</option>
              <option value="3">3. Conexion drenaje</option>
              <option value="4">4. Conexion agua, conexion drenaje</option>
            </SelectCompact>
          </div>
          <div className='flex flex-col gap-2'>
            <InputLabel
              htmlFor='cobros'
              label='Cobros'
            />
            <SelectCompact
              name='cobros'
              id='cobros'
              required
            >
              <option value="">Seleccione...</option>
              <option value="1">1. Agua, Infraestructura y colectores</option>
              <option value="2">2. Agua, Infraestructura</option>
              <option value="3">3. Agua</option>
              <option value="5">5. Infraestructura y colectores</option>
            </SelectCompact>
          </div>
          <div className='flex flex-col gap-2'>
            <InputLabel
              htmlFor='baldio'
              label='Baldio'
            />
            <SelectCompact
              name='baldio'
              id='baldio'
              required
            >
              <option value="">Seleccione...</option>
              <option value="S">Si</option>
              <option value="N">No</option>
            </SelectCompact>
          </div>

          

          <button type='button' onClick={handlePreview} className='bg-stone-800 cursor-pointer text-white px-4 py-2 rounded-md'>Ver previsualizacion</button>

          <button type='button' 
          disabled={!previewVisible}
          onClick={handleConfirmPreview} 
          className={
            previewVisible ?
            'bg-stone-600 cursor-pointer text-white px-4 py-2 rounded-md' :
            'bg-gray-500 cursor-not-allowed text-white px-4 py-2 rounded-md'
          }>Confirmar datos</button>

          <button
            type='submit'
            disabled={!confirmPreview || isLoading}
            className={
              `${!confirmPreview || isLoading ? 
                'bg-gray-500 cursor-not-allowed' 
                : 
                'bg-blue-500 cursor-pointer'} text-white px-4 py-2 rounded-md`
            }
          >{isLoading ? 'Enviando...' : 'Enviar'}</button>
        </form>


      </div>
      
      {/* DATA GRID SECTION */}
      <div className='flex flex-col flex-1 min-w-0 min-h-[50vh] lg:min-h-0 lg:h-full p-3 sm:p-5 lg:overflow-hidden'>
        <div className='shrink-0 text-center pb-3 sm:pb-4'>
            <h1 className='text-xl sm:text-2xl font-thin'>Data Overview</h1>
        </div>
        <div className='flex-1 min-h-[280px] lg:min-h-0 overflow-auto'>
          <DataGrid className='rdg-light w-full h-full min-h-[280px]' columns={columns} rows={rows} />
        </div>
      </div>
    </div>
  )
}

export default AperturasMasivas
