import React from 'react'
import { Link } from 'react-router-dom';

import PadronOld from './PadronOld';
import PadronNew from './PadronNew';

const Padrones = () => {
  return (
    <div>
      <h1 className='text-2xl font-bold'>Padrones</h1>


      <div className='flex flex-col'>
        <Link to="/padron-old">Padron Old</Link>
        <Link to="/padron-new">Padron New</Link>
      </div>
      
      
    </div>
  )
}

export default Padrones