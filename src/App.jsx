import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Overview from './components/Overview';
import Test from './components/Test';

import Fraccionamientos from './pages/overview/Fraccionamientos';
import AperturasMasivas from './pages/overview/AperturasMasivas';
import AutosuficientesMasivas from './pages/overview/AutosuficientesMasivas';
import Padrones from './pages/overview/Padrones';
import PadronOld from './pages/overview/PadronOld';
import PadronNew from './pages/overview/PadronNew';

function App() {
  const [user, setUser] = useState(null);
  console.log('user', user);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);


  //----- render user info right after login -----
  

  //------- Helper Functions -------

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user); // same shape as login
        setError('');
      } catch {
        localStorage.removeItem('token');
        setUser(null);
        setError('failed to fetch user data');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if(isLoading) {
    return (
      <div className='bg-stone-900 text-white h-screen flex flex-col items-center justify-center'>
        <div id='loading-div' className='text-2xl font-bold'>Loading...</div>
      </div>
    );
  }
  


  return(
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path='/' element={<Home user={user} error={error} />} />
        <Route path='/login' element={user ? <Navigate to='/' /> : <Login setUser={setUser} />} />
        <Route path='/register' element={user ? <Navigate to='/' /> : <Register setUser={setUser}/>} />

        {/* tools dahsboard */}
        <Route path='/overview' element={user ? <Overview /> : <Navigate to='/login' />} />

        {/* way of using tools component with user auth */}
        {/* <Route path='/tools' element={user ? <Tools /> : <Navigate to='/login' />} /> */}



        <Route path='/fraccionamientos' element={<Fraccionamientos />} />
        <Route path='/aperturas-masivas' element={user ? <AperturasMasivas /> : <Navigate to='/login' />} />
        <Route path='/autosuficientes-masivas' element={<AutosuficientesMasivas />} />
        <Route path='/padrones' element={<Padrones />} />
        <Route path='/padron-old' element={<PadronOld />} />
        <Route path='/padron-new' element={<PadronNew />} />
      </Routes>
    </Router>
  )
}


export default App;