import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// function checkSession() {
//   // const [user, setUser] = useState(null);
//   // const [error, setError] = useState('');
  
//   let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MTIyNzgyYTY2NmQxMDEwODAyNmFiZiIsImlhdCI6MTc2Mjc5NzY0MCwiZXhwIjoxNzY1Mzg5NjQwfQ.5EKSr4_02pOHMLHSEDtvT48pDiX9RcfjrLIQiZT-R0g';
//   // let token = '';
  
//   if(!token) {
//     console.log('not user session found');
//   } else {
//     console.log(`token available ${token}`);
//   }

// }

// checkSession();



function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  //create function to fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      let token = localStorage.getItem('token');
      if(token) {
        try {
          const res = await axios.get('/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        }
        catch(error) {
          setError('failed to fetch user data');
          localStorage.removeItem('token');
        }
      }
    };
    fetchUser();
  },[]);



  return(
    <Router>
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login setUser={setUser} />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </Router>
  )
}


export default App;