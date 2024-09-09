import React, { useState } from 'react'
import '../../styles/login.css'
import LoginLayout from './LoginLayout'
import SignUpLoginPage from './SignUpLoginPage'
import EnterDetails from './EnterDetails'
import EnterOtp from './EnterOtp'
import Images from '../../utils/Images'
import UserDetailsForm from './UserDetailsForm'

export default function Login() {
    const [loginview, setLoginView] = useState('signuplogin');
    const [email, setEmail] = useState('');

    const getPreviousView = (currentView) => {
        switch (currentView) {
            case 'enteremail':
                return 'signuplogin';
            case 'enterotp':
                return 'enteremail';
            default:
                return '';
        }
    }
    const previousView = getPreviousView(loginview);
    const backgroundImage = loginview == 'signuplogin' ? Images.LoginBackground : Images.PhoneAndOtpBackground;
    return (
        <div>
            <LoginLayout loginview={loginview} setLoginView={setLoginView} previousView={previousView} backgroundImage={backgroundImage}>
                {loginview == 'signuplogin' && (<SignUpLoginPage setLoginView={setLoginView} />)}
                {loginview == 'enteremail' && <EnterDetails setLoginView={setLoginView} setEmail={setEmail}/>}
                {loginview == 'enterotp' && <EnterOtp email={email} setLoginView={setLoginView} loginview={loginview} />}
                {loginview == 'userdetailsform' && <UserDetailsForm />}
            </LoginLayout>
        </div>
    )
}
