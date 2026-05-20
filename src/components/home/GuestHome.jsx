import React from 'react'
import { Link } from 'react-router-dom'
// import homeGuest from '../../assets/images/home/homeGuest.png'

//Using FontAwesomeIcons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faArrowRight } from '@fortawesome/free-solid-svg-icons'



const GuestHome = () => {
  return (
    <div className='flex w-full h-[calc(100dvh-64px)] overflow-hidden'>
        <div id='guest-home-div-1' className='w-1/3 bg-stone-900'>
        </div>



        <div id='guest-home-div-2' className='flex flex-col gap-15 justify-center max-w-[50%] max-h-[80%] m-auto'>
            <div id='heading-div'>
                <h1>
                    <span className='font-bold text-6xl'>APA</span>
                    <br />
                    <span className='font-normal text-5xl'>ASISTENTE</span>
                    <br />
                    <br />

                    <span className='font-normal text-5xl text-red-200'>production - dev merged</span>
                </h1>
            </div>
            <div id='description-div'>
                <p className='text-stone-500'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque culpa at iure delectus asperiores ratione labore, reiciendis debitis magni repellendus esse voluptas id illo earum quasi consequatur, perspiciatis, magnam similique?</p>
            </div>
            <div id='specs-div'>
                <div className='text-stone-500'><FontAwesomeIcon icon={faCheck} /> Procesa Excels y CSV</div>
                <div className='text-stone-500'><FontAwesomeIcon icon={faCheck} /> Genera movimientos masivos dentro de APA</div>
                <div className='text-stone-500'><FontAwesomeIcon icon={faCheck} /> Reportes y estadisticas</div>
            </div>
            <div id='buttons-div' className='flex gap-2'>
                <Link className='bg-stone-900 text-white px-4 py-3 rounded-md' to='/register'>Empezar <FontAwesomeIcon icon={faArrowRight} /></Link>
                <Link className='bg-stone-100 text-stone-900 px-4 py-3 rounded-md' to='/login'>Iniciar sesion</Link>
            </div>
        </div>
    </div>
  );
};

export default GuestHome;
