import React from 'react'

export default function EnterDetails() {
    return (
        <>
            <div className='text-center pt-5 mt-5'>
                <h2 className='fw-normal'>Please Enter Details</h2>
                <div className='p-3 mt-2'>
                    <label className='py-2 me-4'>Username :</label>
                    <input type="text" className='custom-form-control' />
                </div>
                <div className='p-3 mt-2 position-relative'>
                    <label className='py-2 me-2'>Phone Number :</label>
                    <span className='countrycode'>+91</span>
                    <input type="text" className='custom-form-control' style={{paddingLeft:'50px'}}/>
                </div>
                <div className='mt-2'>
                    <span className='fw-light'>We'll sent an SMS with an activation code to your given phone number for verification.</span>
                </div>
                <div className='d-flex align-items-center justify-content-center mt-3'>
                    <div className="form-check me-4 custom-radio">
                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" defaultChecked />
                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                            What's App
                        </label>
                    </div>
                    <div className="form-check custom-radio">
                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                            SMS
                        </label>
                    </div>
                </div>
                <div className='mt-3 p-2'>
                    <button className='otpBtn'>GET OTP</button>
                </div>
            </div>

        </>
    )
}

