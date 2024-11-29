import React, { useState } from 'react'
import useProperty from '../../hooks/useProperty';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { VillaBungalowValidationSchema } from '../../utils/validations/VillaBungalowValidationSchema';
import useApiService from '../../hooks/useApiService';
import AlertComp from '../../components/alerts/AlertComp';
import Loader from '../../components/loader/Loader';
import AllVillaBungalow from './AllVillaBungalow';
import Images from '../../utils/Images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

export default function AddVillaBungalow() {
    const { propertyDetails, schemeId, refreshPropertyDetails } = useProperty();
    const { postAPIAuthKey } = useApiService();
    const [ShowAlerts, setShowAlerts] = useState(false);
    const [loading, setloading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [Data, setData] = useState({
        totalUnits: '',
        unitSize: ''
    })
    const [yesnoRadio, setYesnoRadio] = useState(0);
    const submitDetails = async (values) => {
        var raw = JSON.stringify({
            propertyId: schemeId,
            ...values
        })
        try {
            const result = await postAPIAuthKey('/add-villa-bunglow-details', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    setShowAlerts(<AlertComp show={true} variant="success" message={`${propertyDetails?.property_name} Added Successfully`} />);
                    setTimeout(() => {
                        setloading(false);
                        setShowAlerts(false);
                        setShowAddForm(false);
                        setData({
                            ...Data, totalUnits: '',
                            wingsArray: [],
                            unitSize: ''
                        });
                        setYesnoRadio(0);
                        refreshPropertyDetails();
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
    }
    const AddVillaBunglaow = (
        <div className='pt-2 text-center m-auto'>
            {propertyDetails?.unit_details?.length > 0 &&
                <div className='existingUnitsDiv'>
                    <div className="row align-items-center px-0">
                        <div className='col-md-2'>
                            <FontAwesomeIcon icon={faChevronLeft} onClick={() => setShowAddForm(false)} className='cursor-pointer' />
                            <label className='fontwhite mb-0 ps-4'>Current {propertyDetails?.property_name}s : </label>
                        </div>
                        <div className='col-10 d-flex flex-wrap'>
                            {propertyDetails?.unit_details?.map((item, index) => {
                                return <div className="unitNamesDiv mx-1 font-12" key={index}>{item.name}</div>
                            })}
                        </div>
                    </div>
                </div>
            }

            <div className='row align-items-center pt-5'>
                <h4 className='heading mb-0'>Add {propertyDetails?.property_name} Details</h4>
            </div>
            <Formik initialValues={Data}
                enableReinitialize={true}
                validateOnBlur={false}
                validateOnChange={false}
                validationSchema={VillaBungalowValidationSchema(yesnoRadio)}
                onSubmit={(values) => {
                    setData(values);
                    submitDetails(values);
                }}>
                {() => (
                    <Form className='pt-4 mt-2 property-form col-md-6 offset-md-3' >
                        <div className="row">
                            <div className='col-md-12 ps-0 position-relative mb-4'>
                                <label className='custom-label'>How many {propertyDetails?.property_name} in this scheme?<span className='text-danger'>*</span></label>
                                <Field type="number" min={0} className="customInput" name='totalUnits' autoComplete='off' />
                                <ErrorMessage name='totalUnits' component="div" className="text-start errorText" />
                            </div>
                        </div>
                        <div className='row py-3 ps-0 text-white'>
                            <label className='ps-0 '>Is there same size of every {propertyDetails?.property_name} in this scheme?</label>
                            <div className='col-md-12 ps-0 d-flex justify-content-center'>
                                <div className='text-center pt-2'>
                                    <input type='radio' className='form-check-input cursor-pointer me-2'
                                        name='yes' onChange={(e) => setYesnoRadio(1)} checked={yesnoRadio == 1} />
                                    <label>Yes</label>
                                </div>
                                <div className='text-center pt-2 ps-5'>
                                    <input type='radio' className='form-check-input cursor-pointer me-2'
                                        name='yes' onChange={(e) => setYesnoRadio(2)} checked={yesnoRadio == 2} />
                                    <label>No</label>
                                </div>
                            </div>
                        </div>
                        {yesnoRadio == 1 && (
                            <div className="row my-4">
                                <div className='col-md-12 ps-0 position-relative '>
                                    <label className='custom-label'>Write the size of {propertyDetails?.property_name}<span className='text-danger'>*</span></label>
                                    <Field type="number" min={0} className="customInput" name='unitSize' autoComplete='off' />
                                    <ErrorMessage name='unitSize' component="div" className="text-start errorText" />
                                </div>
                                <label className='pt-4 ps-0 fontwhite font-13 text-start'>Notes : System take this unit size automatically in your building view and you can also edit it there.</label>
                            </div>
                        )}
                        {yesnoRadio == 2 && (
                            <div className="row mb-4">
                                <div className='pt-2 ps-0 fontwhite font-13 '>Notes : You can add and edit {propertyDetails?.property_name} size after your building view.</div>
                            </div>
                        )}
                        {yesnoRadio != 0 && (
                            <div className='pt-3'>
                                <button type="submit" className='otpBtn'>Proceed</button>
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
        </div>
    );
    return (
        <div>
            {ShowAlerts}
            {loading && <Loader runningcheck={loading} />}

            {!showAddForm && propertyDetails?.unit_details?.length > 0 ?
                <AllVillaBungalow setShowAddForm={setShowAddForm} setShowAlerts={setShowAlerts} setloading={setloading} />
                :
                AddVillaBunglaow
            }
        </div>
    )
}
