import React from 'react'
import Images from '../../utils/Images'

export default function LoginLayout({ children }) {
    return (
        <>
            <div className='loginLayout position-relative' style={{ background: '#03053D', minHeight: '100vh' }}>
                <div className='text-center text-white pt-5'>
                    <img src={Images.realEstateLogo} alt="realestatelogo" className='' />
                    <div className='login-content'>
                        {children}
                    </div>
                    <div className='position-absolute pt-5 mt-5' style={{ bottom: '9%', left: '25%' }}>
                        <span className='fw-light'>By signing in, you agree to our Terms of Service and acknowledge that our Privacy Policy applies to you.</span>
                    </div>
                </div>
            </div>
        </>
    )
}
