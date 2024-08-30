import React, { useState } from 'react'
import '../../styles/login.css'
import LoginLayout from './LoginLayout'
import SignUpLoginPage from './SignUpLoginPage'
import EnterDetails from './EnterDetails'

export default function Login() {
    const [loginview, setLoginView] = useState('signuplogin')
    return (
       <LoginLayout>
        {loginview == 'signuplogin' &&  (<SignUpLoginPage setLoginView={setLoginView}/>)}
        {loginview == 'phonenumber' && <EnterDetails />}
       </LoginLayout>
    )
}
