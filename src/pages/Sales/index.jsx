import React, { useEffect } from 'react'
import useProperty from '../../hooks/useProperty';
import { useNavigate } from 'react-router-dom';

export default function SalesIndex() {
    const { propertyDetails } = useProperty();
    const navigate = useNavigate();
    useEffect(() => {
        if (propertyDetails?.wingsflag == 1) {
            navigate('/all-wings');
        } else {
            navigate('/add-wings')
        }

    }, [navigate]);
    return null;
}
