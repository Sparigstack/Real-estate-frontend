import React from 'react'
import Images from '../../utils/Images'
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function LoginLayout({ children, loginview, setLoginView }) {
    return (
        <>
            <LazyLoadImage src={Images.loginbackground} alt="" className="BackgroundImageLogin" />
            <div className="position-absolute top-35 start-50 translate-middle text-center text-white" >
                <div className='text-center text-white pt-5'>
                    <div className="d-flex align-items-center justify-content-center position-relative">
                        {loginview != 1 && (
                            <img src={Images.backArrow} alt="back-arrow"
                                className='position-absolute cursor-pointer' style={{ left: "5%", height: '40px' }}
                                onClick={() => setLoginView(loginview - 1)} />
                        )}
                        <img src={Images.realEstateLogo} alt="realestatelogo" className='' />
                    </div>
                    <div className='loginContent'>
                        {children}
                    </div>
                    <div className='col-12'>
                        <small className='color-D8DADCE5'>By signing in, you agree to our Terms of Service and acknowledge that our Privacy Policy applies to you.</small>
                    </div>
                </div>
            </div>
        </>
    )
}
