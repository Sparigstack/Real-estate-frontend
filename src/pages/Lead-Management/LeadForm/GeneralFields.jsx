import { ErrorMessage, Field } from 'formik'
import React, { useEffect, useState } from 'react'
import useCommonApiService from '../../../hooks/useCommonApiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';

export default function GeneralFields({ setFieldValue, values }) {
    const { getSources, getLeadStatus } = useCommonApiService();
    const [sourcesData, setsourcesData] = useState([]);
    const [leadStatuses, setleadStatuses] = useState([]);
    useEffect(() => {
        const fetchSources = async () => {
            const sources = await getSources();
            setsourcesData(sources)
        }
        const fetchStatus = async () => {
            const sources = await getLeadStatus();
            setleadStatuses(sources)
        }
        fetchSources();
        fetchStatus();
    }, []);
    return (
        <div className='row fontwhite px-5'>
            <div className='h6 ps-0 pb-3 fw-semibold'>General Fields</div>
            <div className='col-md-8 mb-4 ps-0 position-relative'>
                <label className='custom-label'>Name <span className='text-danger'>*</span></label>
                <Field type="text" className="customInput" name='name' autoComplete='off' />
                <ErrorMessage name='name' component="div" className="text-start errorText" />
            </div>

            <div className='col-md-4 mb-4 ps-0 position-relative'>
                <label className='custom-label'>Source <span className='text-danger'>*</span></label>
                <Field as="select" className="customInput" style={{ background: "#03053d", padding: '1em' }} name='source' onChange={(e) => setFieldValue('source', e.target.value)}>
                    <option value="0" label="Select source" />
                    {sourcesData?.map((item, index) => {
                        return <option value={item.id} label={item.name} key={index} />
                    })}
                </Field>
                <ErrorMessage name='source' component="div" className="text-start errorText" />
            </div>
            <div className='col-md-4 mb-4 ps-0 position-relative'>
                <label className='custom-label'>Status <span className='text-danger'>*</span></label>
                <Field as="select" className="customInput" style={{ background: "#03053d", padding: '1em' }} name='status' onChange={(e) => setFieldValue('status', e.target.value)}>
                    <option value="0" label="Select status" />
                    {leadStatuses?.map((item, index) => {
                        return <option value={item.id} label={item.name} key={index} />
                    })}
                </Field>
                <ErrorMessage name='status' component="div" className="text-start errorText" />
            </div>
            <div className='col-md-4 mb-4 ps-0 position-relative'>
                <label className='custom-label'>Contact No. <span className='text-danger'>*</span></label>
                <div className="input-group">
                    <span className="input-group-text font-13 fontwhite" style={{ backgroundColor: "transparent" }}>+91</span>
                    <Field type="number" className="form-control customInput" name='contactno' autoComplete='off' />
                </div>
                <ErrorMessage name='contactno' component="div" className="text-start errorText" />
            </div>
            <div className='col-md-4 mb-4 ps-0 position-relative'>
                <label className='custom-label'>Email (optional)</label>
                <Field type="text" className="customInput" name='email' autoComplete='off' />
            </div>
            {values.source == "5" && (
                <>
                    <div className='col-md-4 mb-4 ps-0 position-relative'>
                        <label className='custom-label'>Agent Name (optional)</label>
                        <Field type="text" className="customInput" name='agent_name' autoComplete='off' />
                    </div>
                    <div className='col-md-4 mb-4 ps-0 position-relative'>
                        <label className='custom-label'>Agent Contact no. (optional)</label>
                        <div className="input-group">
                            <span className="input-group-text  font-13 fontwhite" style={{ backgroundColor: "transparent" }}>+91</span>
                            <Field type="text" className="form-control customInput" name='agent_contact' autoComplete='off' />
                        </div>
                    </div>
                </>
            )}

        </div>
    )
}
