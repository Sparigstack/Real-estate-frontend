import React from 'react'
import Images from '../../utils/Images'

export default function LoginLayout({ children, loginview, setLoginView, previousView, backgroundImage }) {
    return (
        <>
            <div className={`loginLayout ${loginview != 'signuplogin' ? 'p-4' : ''}`} >
                <div className='text-center text-white pt-5' key={backgroundImage} style={{ background: `url(${backgroundImage})`, minHeight: loginview == 'signuplogin' ? '100vh' : '93vh', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className="d-flex align-items-center justify-content-center position-relative">
                        {loginview != 'signuplogin' && loginview != 'userdetailsform' && (
                            <img src={Images.backArrow} alt="back-arrow" className='position-absolute cursor-pointer' style={{ left: "5%", height: '40px' }} onClick={() => setLoginView(previousView)} />
                        )}
                        <img src={Images.realEstateLogo} alt="realestatelogo" className='' />
                    </div>
                    <div className='loginContent'>
                        {children}
                    </div>
                    {loginview != 'userdetailsform' &&
                        <div className='loginFooter pt-5 mt-5'>
                            <span className='fw-light' style={{ fontSize: '14px' }}>By signing in, you agree to our Terms of Service and acknowledge that our Privacy Policy applies to you.</span>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}
