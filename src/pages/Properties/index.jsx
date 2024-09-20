import React from 'react'
import AddProperty from './AddProperty'
import CommercialProvider from '../../context/CommercialContext'

export default function Propertyindex() {
  return (
    <CommercialProvider>
      <AddProperty />
    </CommercialProvider>
  )

}
