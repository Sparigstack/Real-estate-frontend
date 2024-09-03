import React, { useState } from 'react'
import '../../styles/login.css'
import LoginLayout from './LoginLayout'
import SignUpLoginPage from './SignUpLoginPage'
import EnterDetails from './EnterDetails'
import EnterOtp from './EnterOtp'
import Images from '../../utils/Images'


export default function Login() {
    const [loginview, setLoginView] = useState('signuplogin');

    const getPreviousView = (currentView) => {
        switch(currentView) {
            case 'phonenumber':
                return 'signuplogin';
            case 'enterotp':
                return 'phonenumber';
            default:
                return '';
        }
    }
    const previousView = getPreviousView(loginview);
    const backgroundImage = loginview == 'signuplogin' ? Images.LoginBackground : Images.PhoneAndOtpBackground;
    return (
        <div>
       <LoginLayout loginview={loginview} setLoginView={setLoginView} previousView={previousView} backgroundImage={backgroundImage}>
        {loginview == 'signuplogin' &&  (<SignUpLoginPage setLoginView={setLoginView} />)}
        {loginview == 'phonenumber' && <EnterDetails setLoginView={setLoginView}/>}
        {loginview == 'enterotp' && <EnterOtp/>}
       </LoginLayout>
       </div>
    )
}
