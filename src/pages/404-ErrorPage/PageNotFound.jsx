import React from 'react'

export default function PageNotFound() {
  return (
    <div className='p-3 text-center' style={{ color: "white" }}>
      <h1>Page Not Found</h1>
      <h5>Oops! Sorry the page you are trying to visit does not exist. You can go back to home from button given below. </h5>
      <button className='border-0 p-2 rounded-2 btn btn-info' onClick={() => navigate('/')}>Home</button>
    </div>
  )
}
