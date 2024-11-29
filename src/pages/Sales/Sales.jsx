import React from 'react'
import useProperty from '../../hooks/useProperty';
import AllSchemeTypes from './AllSchemeTypes';
import AddVillaBungalow from './AddVillaBungalow';

export default function Sales() {
    const { propertyDetails } = useProperty();
    return (
        <div>
            <div className='PageHeader'>
                Sales
            </div>
            {propertyDetails?.property_name == "Villa" || propertyDetails?.property_name == "Bunglow" ?
                <AddVillaBungalow />
                :
                <AllSchemeTypes />
            }
        </div>
    )
}
