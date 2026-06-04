import React from 'react'
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { DataGrid } from 'react-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { faFile } from '@fortawesome/free-regular-svg-icons'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

const AperturasMasivas = () => {

  const timeoutRef = useRef(null);
  const [previewData, setPreviewData] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [confirmPreview, setConfirmPreview] = useState(false);

  const [excelFile, setExcelFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  //DATA GRID SECTION
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const [localidad, setLocalidad] = useState('');
  const [colonia, setColonia] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //Cleanup: cancel pending timeout on component unmount
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  const syncFileToInput = (file) => {
    if (!file || !fileInputRef.current) return;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInputRef.current.files = dataTransfer.files;
  };

  const getSelectedFile = () => {
    return selectedFile || fileInputRef.current?.files?.[0] || null;
  };

  const onFileSelected = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setExcelFile(file.name);
    syncFileToInput(file);
    setConfirmPreview(false);
    setFileError(null);
  }

  const handleFileChange = (e) => {
    onFileSelected(e.target.files?.[0]);
  }

  const handleDrop = (e) => {
    e.preventDefault();
    onFileSelected(e.dataTransfer.files?.[0]);
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  }

  const handlePreview = async () => {
    const file = getSelectedFile();
    if (!file) {
      setFileError('Por favor seleccione un archivo Excel o CSV');
      setTimeout(() => {
        setFileError(null);
      }, 3000);
      return;
    }

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    formData.set('file', file);

    setConfirmPreview(false);
    setFileError(null);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/preview-excel/preview`, formData);
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
      setFileError('Error al previsualizar el archivo. Verifique el archivo e intente de nuevo.');
      setTimeout(() => {
        setFileError(null);
      }, 4000);
    }
  }

  const handleConfirmPreview = () => {
    setConfirmPreview(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirmPreview) return;

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const file = getSelectedFile();
    if (file) formData.set('file', file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/aperturas_masivas/apertura`, formData,
        {
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

      return res.data;
    } catch (error) {
      console.log(error);

      if (error.response) {
        clearTimeout(timeoutRef.current);
        setFeedback({
          type: 'error',
          message: 'Error al enviar la apertura masiva',
          statusCode: error.response?.data?.status || null
        })
        timeoutRef.current = setTimeout(() => {
          setFeedback(null);
        }, 4000);
      } else {
        setFeedback({
          type: 'error',
          message: 'No se pudo conectar con el servidor',
          statusCode: null
        });
      }

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

  const inputClass = 'w-full py-3 px-4 min-h-[48px] text-base border-1 border-stone-300 rounded-md';
  const labelClass = 'text-sm font-medium text-stone-600 mb-1.5 block';

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      encType='multipart/form-data'
      className='flex gap-4 w-full min-h-screen'
      action=""
    >
      <div className='bg-[#fff] text-black h-screen w-full max-w-[20%] border-r-1 border-stone-300 hover:border-blue-500 hover:transition-all duration-200 ease-in-out'>

        {
          feedback?.type === 'success' ?
            <div className='text-center text-2xl font-thin py-5 bg-green-500 text-white'>
              <span>{feedback.message}</span>
            </div>
          : null
        }
        {
          feedback?.type === 'error' ?
            <div className='text-center text-2xl font-thin py-5 bg-red-500 text-white'>
              <span>{feedback.message}</span>
            </div>
          : null
        }

        <div className='h-full max-h-[10%] p-5 text-center border-b-1 border-stone-300'>
          <h1 className='text-2xl font-thin'>Aperturas Masivas</h1>
        </div>

        <div className='h-full max-h-[90%] flex flex-col gap-2 p-5'>
          <h1 className='text-2xl font-thin'>Subir Archivo</h1>
          <span className='text-sm text-stone-500'>Sube un archivo Excel o CSV para previsualizar</span>
          <hr className='border-stone-300 w-full border-b-0.5 my-4' />

          <div className='flex flex-col gap-2'>
            <span className={labelClass}>Seleccionar Archivo</span>
            <label
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              htmlFor="aperturas-file"
              className='text-sm text-stone-500 border-dashed border-1 border-stone-300 hover:border-green-500 hover:transition-all duration-200 ease-in-out rounded-md p-2 w-full h-[300px] text-center flex items-center justify-center cursor-pointer'
            >
              {
                excelFile ?
                  <span className='text-sm text-stone-500'>Archivo seleccionado: <b>{excelFile}</b></span> :
                  'Arrastra, o seleccione el archivo Excel, XLSX'
              }
              <input
                ref={fileInputRef}
                type="file"
                id="aperturas-file"
                name="file"
                className='hidden'
                onChange={handleFileChange}
                accept='.xlsx,.xls,.csv'
              />
            </label>
          </div>
          <hr className='border-stone-300 w-full border-b-0.5 my-4' />

          <button type='button' onClick={handlePreview} className='bg-stone-800 cursor-pointer text-white px-4 py-2 rounded-md flex items-center gap-2 justify-center'>
            <FontAwesomeIcon icon={faEye} />
            Ver previsualizacion
          </button>
          {fileError && <span className='text-red-500 font-bold'>{fileError}</span>}

          <button
            type='button'
            disabled={!previewVisible}
            onClick={handleConfirmPreview}
            className={
              previewVisible ?
                'bg-stone-600 cursor-pointer text-white px-4 py-2 rounded-md' :
                'bg-gray-500 cursor-not-allowed text-white px-4 py-2 rounded-md'
            }
          >Confirmar datos</button>
        </div>

      </div>

      <div className='w-full max-w-[80%] p-5 h-screen'>
        <div className='h-full max-h-[10%] text-center'>
          <h1 className='text-2xl font-thin'>Data Overview</h1>
        </div>

        <div className='h-full flex flex-col gap-4 min-h-0'>
          <div className='flex flex-col items-center border-1 border-stone-300 rounded-md p-1 flex-1 min-h-[200px]'>
            {
              previewData ? (
                <DataGrid className='flex-1 rdg-light w-full' columns={columns} rows={rows} />
              ) : (
                <div className='flex flex-col gap-2 items-center justify-center w-full h-full'>
                  <div className='flex flex-col gap-2 items-center justify-center w-full h-full'>
                    <FontAwesomeIcon className='text-stone-500 text-3xl' icon={faFile} />
                    <span className='text-sm text-stone-500'>Sin datos</span>
                    <span className='text-sm text-stone-500'>Sube un archivo Excel, y da click en &quot;Ver previsualizacion&quot; para ver el contenido del archivo</span>
                  </div>
                </div>
              )
            }
          </div>

          <div className='shrink-0 min-h-[480px] max-h-[55vh] bg-stone-50 rounded-md border-1 border-stone-300'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 border-t-1 border-stone-300 p-6 h-full overflow-y-auto'>
              <div className='sm:col-span-2'>
                <h2 className='text-lg font-medium text-stone-700 mb-1'>Datos de apertura</h2>
                <p className='text-sm text-stone-500'>Complete los campos y confirme la previsualización antes de enviar</p>
              </div>
              <div>
                <label htmlFor="folio" className={labelClass}>Folio / nombre del archivo</label>
                <input type="text" id="folio" name="folio" required className={inputClass} placeholder='folio / nombre del archivo' />
              </div>
              <div>
                <label htmlFor="localidad" className={labelClass}>Localidad</label>
                <input
                  type="text"
                  id="localidad"
                  name="localidad"
                  required
                  className={inputClass}
                  placeholder='localidad'
                  onChange={handleChangeLocalidad}
                  value={localidad}
                />
              </div>
              <div>
                <label htmlFor="colonia" className={labelClass}>Colonia</label>
                <input
                  type="text"
                  id="colonia"
                  name="colonia"
                  required
                  className={inputClass}
                  placeholder='colonia'
                  onChange={handleChangeColonia}
                  value={colonia}
                />
              </div>
              <div>
                <label htmlFor="tipo_servicio" className={labelClass}>Tipo de predio</label>
                <select id="tipo_servicio" name="tipo_servicio" required className={inputClass}>
                  <option value="">Seleccione...</option>
                  <option value="H">Habitacional</option>
                  <option value="C">Comercial</option>
                  <option value="I">Industrial</option>
                  <option value="E">Uso de Gobierno</option>
                </select>
              </div>
              <div>
                <label htmlFor="conexiones" className={labelClass}>Conexiones</label>
                <select id="conexiones" name="conexiones" required className={inputClass}>
                  <option value="">Seleccione...</option>
                  <option value="1">1. Ninguna</option>
                  <option value="2">2. Conexion Agua</option>
                  <option value="3">3. Conexion drenaje</option>
                  <option value="4">4. Conexion agua, conexion drenaje</option>
                </select>
              </div>
              <div>
                <label htmlFor="cobros" className={labelClass}>Cobros</label>
                <select id="cobros" name="cobros" required className={inputClass}>
                  <option value="">Seleccione...</option>
                  <option value="1">1. Agua, Infraestructura y colectores</option>
                  <option value="2">2. Agua, Infraestructura</option>
                  <option value="3">3. Agua</option>
                  <option value="5">5. Infraestructura y colectores</option>
                </select>
              </div>
              <div>
                <label htmlFor="baldio" className={labelClass}>Baldio</label>
                <select id="baldio" name="baldio" required className={inputClass}>
                  <option value="">Seleccione...</option>
                  <option value="S">Si</option>
                  <option value="N">No</option>
                </select>
              </div>
              <div className='sm:col-span-2 pt-2'>
                <button
                  type='submit'
                  disabled={!confirmPreview || isLoading}
                  className={
                    `${!confirmPreview || isLoading ?
                      'bg-gray-500 cursor-not-allowed'
                      :
                      'bg-blue-500 cursor-pointer hover:bg-blue-600'} text-white text-base font-medium px-6 py-3 min-h-[48px] rounded-md flex items-center gap-2 w-full sm:w-auto`
                  }
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                  {isLoading ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default AperturasMasivas
