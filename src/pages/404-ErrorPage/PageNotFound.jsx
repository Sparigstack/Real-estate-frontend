import React from 'react'
import Images from '../../utils/Images'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

export default function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <img src={Images.error_page} className='img-fluid' />
          <div className="text-center pt-5" style={{ color: '#495057' }}>
            <h3>SORRY, PAGE NOT FOUND</h3>
          </div>
          <div className="text-center pt-1" style={{ color: '#878a99' }}>
            <h6>The page you are looking for is not available!</h6>
          </div>
          <div className="text-center pt-3">
            <label className="cursor-pointer mx-2" onClick={() => navigate('/')}>
              <FontAwesomeIcon icon={faHome} className="pe-2" /> Back to home
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
