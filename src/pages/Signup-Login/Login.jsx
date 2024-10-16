import React, { useState } from 'react'
import LoginLayout from './LoginLayout'
import LandingPage from './LandingPage'
import EnterOtp from './EnterOtp'
import LoginDetails from './LoginDetails'
import Loader from '../../components/loader/Loader'

export default function Login() {
    const [loginview, setLoginView] = useState(1);
    const [formData, setFormData] = useState({ email: '', username: '' });
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    return (
        <>
            {showAlerts}
            {loading && <Loader runningcheck={loading} />}
            <LoginLayout loginview={loginview} setLoginView={setLoginView}>
                {loginview == 1 && <LandingPage setLoginView={setLoginView} setLoading={setLoading} />}
                {loginview == 2 && <LoginDetails setShowAlerts={setShowAlerts} setLoginView={setLoginView} setLoading={setLoading} formData={formData} setFormData={setFormData} />}
                {loginview == 3 && <EnterOtp formData={formData} setLoading={setLoading} setShowAlerts={setShowAlerts} />}
            </LoginLayout>
        </>
    )
}
