import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';


const Login = ({ setUser }) => {
    //in case of error, data will be stored here
    const [error, setError] = useState('');
    //here we will store data of form
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    //clean input fields in case of error
    useEffect(() => {
        if(error) {
            setFormData({email: '', password: ''});
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    }, [error]);

    //------- Helper Functions -------
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('/api/users/login', formData);
            console.log(res.data);
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            navigate('/');
        }
        catch(error) {
            setError('Failed to login');
            
        }
    }



    
  return (
    <div id='login-page-container' className='bg-stone-900 text-white h-screen flex flex-col items-center justify-center'>
        <div id='login-page-div'>
            <h1>Login Page</h1>
        </div>
        <div id='input-form-div'>
            <form onSubmit={handleSubmit}>
                <div className='email-input-div flex gap-4'>
                    <label htmlFor="email">Email</label>
                    <input className='bg-stone-100 text-black' type="email" id="email" required placeholder='Enter your email' name='email' onChange={handleChange} value={formData.email} />
                </div>
                <div className='password-input-div flex gap-4'>
                    <label htmlFor="password">Password</label>
                    <input className='bg-stone-100 text-black' type="password" id='password' required placeholder='Enter your password' name='password'onChange={handleChange} value={formData.password} />
                </div>
                <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer'>Login</button>
            </form>
        </div>
        {error && <p className='text-red-500'>{error}</p>}
        
    </div>
  )
}

export default Login
