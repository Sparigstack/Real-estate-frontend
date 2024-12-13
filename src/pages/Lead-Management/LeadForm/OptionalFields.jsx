import { ErrorMessage, Field } from 'formik';
import React, { useEffect, useState } from 'react'
import useCommonApiService from '../../../hooks/useCommonApiService';

export default function OptionalFields({ setFieldValue, values }) {
    const { getAllStates, getCities } = useCommonApiService();
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    useEffect(() => {
        const fetchStates = async () => {
            const sources = await getAllStates();
            setStates(sources)
        }
        fetchStates();
    }, []);
    useEffect(() => {
        if (values.city) {
            GetCities(values.state)
        }
    }, [values.city])
    const GetCities = async (stateid) => {
        var cities = await getCities(stateid);
        if (cities) {
            setCities(cities)
        }
    }
    return (
        <div className='row fontwhite pt-4 px-5'>
            <div className='h6 ps-0 pb-4 fw-semibold'>Additional Fields</div>
            <div className='col-md-6 mb-4 ps-0 position-relative'>
                <label className='custom-label'>Address (optional)</label>
                <Field type="textarea" className="customInput" name='address' autoComplete='off' />
            </div>

            <div className='col-md-3 mb-4 ps-0 position-relative'>
                <label className='custom-label'>State (optional)</label>
                <Field as="select" className="customInput" name='state' style={{ background: "#03053d", padding: '1em' }}
                    onChange={(e) => { GetCities(e.target.value); setFieldValue('state', e.target.value) }}>
                    <option value="0" label="Select State" />
                    {states?.map((item, index) => {
                        return <option value={item.id} label={item.name} key={index} />
                    })}
                </Field>
                <ErrorMessage name='state' component="div" className="text-start errorText" />
            </div>
            <div className='col-md-3 mb-4 ps-0 position-relative'>
                <label className='custom-label'>City (optional)</label>
                <Field as="select" value={values.city} className="customInput" style={{ background: "#03053d", padding: '1em' }}
                    name='city' onChange={(e) => setFieldValue('city', e.target.value)}>
                    <option value="0" label="Select City" />
                    {cities?.map((item, index) => {
                        return <option value={item.id} label={item.name} key={index} />
                    })}
                </Field>
                <ErrorMessage name='city' component="div" className="text-start errorText" />
            </div>
            <div className='col-md-3 ps-0 position-relative mb-4'>
                <label className='custom-label'>Pincode (optional)</label>
                <Field type="text" className="customInput" name='pincode' autoComplete='off' />
            </div>
            <div className='col-md-3 mb-4 ps-0 position-relative'>
                <label className='custom-label'>Reminder Date (optional)</label>
                <Field type="date" className="customInput reminderdate" name='reminder_date' autoComplete='off' />
            </div>
            <div className='col-md-6 mb-4 ps-0 position-relative'>
                <label className='custom-label'>Notes (optional)</label>
                <Field type="textarea" className="customInput" name='notes' autoComplete='off' />
            </div>
        </div>
    )
}
