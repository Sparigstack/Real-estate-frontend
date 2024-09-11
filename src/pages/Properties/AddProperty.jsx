import React from 'react'
import Images from '../../utils/Images'
import CommercialProvider from '../../context/CommercialContext'

export default function AddProperty() {
    return (
        <CommercialProvider>
        <div className="row p-4">
            <div className='col-md-5 offset-md-4'>
                <h4 className='heading pt-5'>Add Property !</h4>
                <p className='font-16 text-white fw-normal'>It will only take 5 minutes to add property details. <span className='fw-bold'>Let's Start</span></p>
                <h5 className='pt-3 text-white fw-semibold'>Choose your Scheme type?</h5>
                <div className='row pt-3'>
                    <div className="col-md-5">
                        <div className='propertiesOptions'>
                            <img src={Images.commercial} alt="commercial" style={{height:'30px'}}/>
                            <br />
                            Commercial
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className='propertiesOptions'>
                        <img src={Images.residential} alt="residential" style={{height:'30px'}}/>
                        <br />
                            Residential
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </CommercialProvider>
    )
}
