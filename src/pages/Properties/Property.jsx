import React from 'react'
import AddProperty from './AddProperty'
import CommercialProvider from '../../context/CommercialContext'

export default function Property() {
  return (
    <CommercialProvider>  
        <AddProperty/>
    </CommercialProvider>
    )
  
}
