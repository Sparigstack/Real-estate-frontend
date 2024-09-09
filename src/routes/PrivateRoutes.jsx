import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Login from '../pages/Signup-Login/Login';

export default function PrivateRoutes() {
    const navigate = useNavigate();
    const token = Cookies.get('authToken'); 
    return token ?  <Outlet /> : <Login/>
  
    // useEffect(() => {
    //   if (!token) {       
    //     navigate('/login');
    //   }
    // }, [token, navigate]);
  
    // return token ? children : null;
}
