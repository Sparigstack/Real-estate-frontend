import React from 'react'
import { useNavigate } from 'react-router-dom'
import Images from '../../utils/Images';

export default function Propertyindex() {
  const navigate = useNavigate();
  return (
    <div className="text-center p-4">
    <h4 className='heading pt-5'>Add Property !</h4>
    <p className='font-16 text-white fw-normal'>It will only take 5 minutes to add property details. <span className='fw-bold'>Let's Start</span></p>
    <h5 className='pt-3 text-white fw-semibold'>Choose your Scheme type?</h5>
    <div className='text-center d-flex justify-content-center gap-3 pt-3'>
        <div className='propertiesOptions cursor-pointer' onClick={() => navigate('/commercial')}>
            <img src={Images.commercial} alt="commercial" style={{ height: '30px' }} />
            <br />
            Commercial
        </div>
        <div className='propertiesOptions cursor-pointer' onClick={() => navigate('/residential')}>
            <img src={Images.residential} alt="residential" style={{ height: '30px' }} />
            <br />
            Residential
        </div>

    </div>

</div>
  )

}
