import React from 'react'
import Images from '../../utils/Images'

export default function LoginLayout({ children, loginview, setLoginView }) {
    return (
        <div className="content-area h-100vh">
            <div className='text-center text-white pt-5'>
                <div className="d-flex align-items-center justify-content-center position-relative">
                    {loginview != 1 && (
                        <img src={Images.backArrow} alt="back-arrow"
                            className='position-absolute cursor-pointer' style={{ left: "5%", height: '40px' }}
                            onClick={() => setLoginView(1)} />
                    )}
                    <img src={Images.realEstateLogo} alt="realestatelogo" className='logosize' />
                </div>
                <div className='loginContent'>
                    {children}
                </div>
                <div className='col-12'>
                    <small className='color-D8DADCE5'>By signing in, you agree to our Terms of Service and acknowledge that our Privacy Policy applies to you.</small>
                </div>
            </div>
        </div>
    )
}
