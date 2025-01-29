import React from 'react'
import useProperty from '../../hooks/useProperty';
import AllSchemeTypes from './AllSchemeTypes';
import AddVillaBungalow from './AddVillaBungalow';
import { useNavigate } from 'react-router-dom';

export default function Sales() {
    const { propertyDetails } = useProperty();
    const navigate = useNavigate();
    return (
        <div>
            <div className='PageHeader'>
                <label className='graycolor cursor-pointer' onClick={(e) => navigate('/sales-dashboard')}>Sales Dashboard / </label>
                &nbsp;Sales
            </div>
            {propertyDetails?.property_name == "Villa" || propertyDetails?.property_name == "Bunglow" ?
                <AddVillaBungalow />
                :
                <AllSchemeTypes />
            }
        </div>
    )
}
