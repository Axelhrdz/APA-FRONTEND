import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

const PadronesPrev = () => {
  return (
    <div className='flex flex-col gap-6 my-5'>
      <div className='flex gap-3'>
        <div>
          <FontAwesomeIcon icon={faScrewdriverWrench} />
        </div>
        <div className='text-stone-500 flex flex-col gap-2'>
          <h1 className='text-2xl font-thin'>Padrones</h1>
          <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea incidunt eius quis facilis facere numquam est suscipit ipsam ipsa in?</span>
        </div>
      </div>

      <hr />

      <div className='text-blue-500'>
        <Link to="/padrones" className='text-white hover:text-stone-500 bg-black py-3 px-4 rounded-md'>Ver mas</Link>
      </div>
    </div>
  )
}

export default PadronesPrev
