import React, { useCallback, useState } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { debounce, property } from 'lodash';
import { WingsValidationSchema } from '../../utils/validations/WingsValidationSchema';
import useProperty from '../../hooks/useProperty';
import useApiService from '../../hooks/useApiService';
import AlertComp from '../../components/alerts/AlertComp';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/loader/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

export default function AddWings() {
    const [loading, setloading] = useState(false);
    const navigate = useNavigate();
    const { schemeId, refreshPropertyDetails, propertyDetails } = useProperty();
    const { postAPIAuthKey } = useApiService();
    const [showAlerts, setShowAlerts] = useState(false);
    const [wingsData, setwingsData] = useState({
        totalWings: '',
        wingsArray: []
    })
    const generateDefaultWingName = (index) => {
        return String.fromCharCode(65 + index);
    };
    const submitWingsDetails = async (values) => {
        setloading(true);
        var raw = JSON.stringify({
            ...values, propertyId: schemeId
        })
        try {
            const result = await postAPIAuthKey('/add-wing-details', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    setShowAlerts(<AlertComp show={true} variant="success" message="Wings Added Successfully." />);
                    setTimeout(() => {
                        setloading(false);
                        setShowAlerts(false);
                        refreshPropertyDetails();
                        navigate("/sales");
                    }, 2500);
                }
                else {
                    setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs?.message} />);
                    setTimeout(() => {
                        setloading(false);
                        setShowAlerts(false);
                    }, 2000);
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    };
    const updateWingsArray = (totalWings) => {
        if (!isNaN(totalWings) && totalWings > 0) {
            const wingsArray = Array.from({ length: totalWings }, (_, index) => ({
                wingName: generateDefaultWingName(index)
            }));

            setwingsData((prevData) => ({
                ...prevData,
                totalWings,
                wingsArray
            }));
        } else {
            setwingsData((prevData) => ({
                ...prevData,
                totalWings: 0,
                wingsArray: []
            }));
        }
    };
    const handleTotalWingsChange = useCallback(
        debounce((value) => {
            const totalWings = parseInt(value, 10);
            updateWingsArray(totalWings);
        }, 300),
        []
    );
    return (
        <div>
            {showAlerts}
            {loading && <Loader runningcheck={loading} />}
            <div className='PageHeader'>
                <div className='align-items-center'>
                    <label className='graycolor cursor-pointer' onClick={(e) => navigate('/sales')}>
                        Sales /</label> Add Wings
                </div>
            </div>
            {propertyDetails?.wing_details?.length > 0 &&
                <div className='existingUnitsDiv mt-2'>
                    <div className="row align-items-center px-0">
                        <div className='col-md-2'>
                            <FontAwesomeIcon icon={faChevronLeft} onClick={() => navigate('/sales')} className='cursor-pointer' />
                            <label className='fontwhite mb-0 ps-4'>Current wings : </label>
                        </div>
                        <div className='col-10 d-flex flex-wrap'>
                            {propertyDetails?.wing_details?.map((item, index) => {
                                return <div className="unitNamesDiv mx-1 font-12" key={index}>{item.name}</div>
                            })}
                        </div>
                    </div>
                </div>
            }
            <div className='p-5  text-center m-auto'>
                <div className='row align-items-center'>
                    <h4 className='heading mb-0'>Add Wing Details</h4>
                </div>
                <Formik initialValues={wingsData}
                    enableReinitialize={true}
                    validateOnBlur={false}
                    validateOnChange={false}
                    validationSchema={WingsValidationSchema(wingsData.totalWings)}
                    onSubmit={(values) => {
                        setwingsData(values);
                        submitWingsDetails(values);
                    }}>
                    {({ values, setFieldValue }) => (
                        <Form className='pt-4 mt-2 property-form col-md-6 offset-md-3' >
                            <div className="row">
                                <div className='col-md-12 ps-0 position-relative mb-4'>
                                    <label className='custom-label'>How many wings in this scheme?<span className='text-danger'>*</span></label>
                                    <Field type="number" min={0} className="customInput" name='totalWings' autoComplete='off'
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setFieldValue('totalWings', value);
                                            handleTotalWingsChange(value);
                                        }} />
                                    <ErrorMessage name='totalWings' component="div" className="text-start errorText" />
                                </div>
                            </div>
                            <div className='row'>
                                {values.wingsArray?.map((item, index) => (
                                    <div key={index} className='col-md-4 ps-0 position-relative mb-4'>
                                        <label className='custom-label'>
                                            Wing {index + 1} Name<span className='text-danger'>*</span>
                                        </label>
                                        <Field
                                            type="text"
                                            className="customInput"
                                            name={`wingsArray[${index}].wingName`}
                                            value={item.wingName}
                                            autoComplete='off'
                                        />
                                        <ErrorMessage name={`wingsArray[${index}].wingName`} component="div" className="text-start errorText" />
                                    </div>
                                ))}
                            </div>
                            <div className='pt-3'>
                                <button type="submit" className='otpBtn'>Proceed</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}
