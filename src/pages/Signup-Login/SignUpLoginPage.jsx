import React from 'react'
import Images from '../../utils/Images'

export default function SignUpLoginPage({setLoginView}) {
    return (
        <>
            <div className='pt-5 mt-5'>
                <h1 className='fw-bold'>Blueprint to Completion,</h1>
                <h1 className='fw-medium p-2'>Seamless Builders Management..!</h1>
                <p className='fw-normal p-2'>Ready to explore</p>
            </div>
            <div className='pt-5 mt-5'>
                <button className='loginBtn' onClick={()=> setLoginView('phonenumber')}>
                    <img src={Images.phone} alt="phone" className='me-3'/>
                    Sign up/ Login with Phone number
                </button>
            </div>
        </>
    )
}
