import React, { useContext, useEffect, useState } from 'react'
import Images from '../../utils/Images'
import  { CommercialContext } from '../../context/CommercialContext'
import Commercial from './Commercial';



export default function AddProperty() {
    const { propertyFlag, setPropertyFlag} = useContext(CommercialContext);
   
    return (
        <>
            {propertyFlag == 0 && (
                <div className="text-center p-4">
                        <h4 className='heading pt-5'>Add Property !</h4>
                        <p className='font-16 text-white fw-normal'>It will only take 5 minutes to add property details. <span className='fw-bold'>Let's Start</span></p>
                        <h5 className='pt-3 text-white fw-semibold'>Choose your Scheme type?</h5>
                        <div className='text-center d-flex justify-content-center gap-3 pt-3'>                            
                                <div className='propertiesOptions cursor-pointer'  onClick={() => setPropertyFlag(1)}>
                                    <img src={Images.commercial} alt="commercial" style={{ height: '30px' }} />
                                    <br />
                                    Commercial
                                </div>                         
                                <div className='propertiesOptions cursor-pointer' onClick={() => setPropertyFlag(2)}>
                                    <img src={Images.residential} alt="residential" style={{ height: '30px' }} />
                                    <br />
                                    Residential
                                </div>
                           
                        </div>
                   
                </div>
            )}
            {propertyFlag == 1 && 
            <Commercial/>
            }
        </>
    )
}
