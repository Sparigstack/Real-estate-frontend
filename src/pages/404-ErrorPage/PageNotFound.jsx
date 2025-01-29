import React from 'react'
import Images from '../../utils/Images'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

export default function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div className="row content-area">
      <div className="py-3 text-center">
        <h3 className='fontwhite'>Ooops...!!</h3>
        <img src={Images.error_img} className='img-fluid h-50' />
        <div className="text-center fontwhite">
          <h3>PAGE NOT FOUND</h3>
        </div>
        <div className="text-center pt-1 fontwhite">
          <h6>Sorry the page you are trying to visit does not exist.</h6>
        </div>
        <div className="text-center pt-3">
          <label className="WhiteBtn cursor-pointer mx-2" onClick={() => navigate('/sales-dashboard')}>
            <FontAwesomeIcon icon={faHome} className="pe-2" /> Back to Home
          </label>
        </div>
      </div>
    </div>
  )
}
