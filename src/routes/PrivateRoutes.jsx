import React from 'react'
import { Outlet} from 'react-router-dom';
import Cookies from 'js-cookie';
import Login from '../pages/Signup-Login/Login';

export default function PrivateRoutes() {
    const token = Cookies.get('authToken'); 
    return token ?  <Outlet /> : <Login/>  
}
