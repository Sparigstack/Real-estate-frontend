import React, { useEffect, useState } from 'react'
import '../../styles/login.css'
import LoginLayout from './LoginLayout'
import SignUpLoginPage from './SignUpLoginPage'
import EnterOtp from './EnterOtp'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import LoginDetails from './PhoneNumber/LoginDetails'

export default function Login() {
    const [loginview, setLoginView] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        username: ''
    });
    const navigate = useNavigate();
    const token = Cookies.get('authToken');
    useEffect(() => {
        if (token) {
            navigate('/dashboard');
        }
    }, [])
    return (
        <div>
            <LoginLayout loginview={loginview} setLoginView={setLoginView}>
                {loginview == 1 && (<SignUpLoginPage setLoginView={setLoginView} />)}
                {loginview == 2 && <LoginDetails setLoginView={setLoginView} formData={formData} setFormData={setFormData} />}
                {loginview == 3 && <EnterOtp formData={formData} />}
            </LoginLayout>
        </div>
    )
}
