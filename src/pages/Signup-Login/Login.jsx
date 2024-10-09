import React, { useState } from 'react'
import LoginLayout from './LoginLayout'
import LandingPage from './LandingPage'
import EnterOtp from './EnterOtp'
import LoginDetails from './LoginDetails'

export default function Login() {
    const [loginview, setLoginView] = useState(1);
    const [formData, setFormData] = useState({ email: '', username: '' });
    return (
        <div className='position-relative'>
            <LoginLayout loginview={loginview} setLoginView={setLoginView}>
                {loginview == 1 && <LandingPage setLoginView={setLoginView} />}
                {loginview == 2 && <LoginDetails setLoginView={setLoginView} formData={formData} setFormData={setFormData} />}
                {loginview == 3 && <EnterOtp formData={formData} />}
            </LoginLayout>
        </div>
    )
}
