import React, { useEffect, useState } from 'react'
import PropertiesValidationSchema from '../../utils/validations/PropertiesValidationSchema';
import { Field, Formik, Form, ErrorMessage } from 'formik'
import useApiService from '../../services/ApiService';
import ShowLoader from '../../components/loader/ShowLoader';
import HideLoader from '../../components/loader/HideLoader';
import Cookies from 'js-cookie';
import AlertComp from '../../components/AlertComp';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddPropertyForm() {
    var { schemeType } = useParams();
    const { getAPI, postAPI } = useApiService();
    const userId = Cookies.get('userId');
    const navigate = useNavigate();
    const [commercialDetails, setCommercialDetails] = useState({
        propertyname: '',
        reraregisterednumber: '',
        propertysubtype: '',
        address: '',
        pincode: '',
        numberofWings: '',
        description: '',
    });
    const [selectedPropertySubType, setSelectedPropertySubType] = useState(null);
    const [propertyTypeArray, setpropertyTypeArray] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    useEffect(() => {
        const getPropertyTypes = async () => {
            try {
                const result = await getAPI(`/get-property-types/${schemeType}`, 3);
                if (!result || result == "") {
                    alert('Something went wrong');
                }
                else {
                    const responseRs = JSON.parse(result);
                    setpropertyTypeArray(responseRs?.sub_properties)
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        getPropertyTypes();
    }, []);
    const submitCommercialDetails = async (values) => {
        setLoading(true);
        var raw = JSON.stringify({
            name: values?.propertyname,
            reraRegisteredNumber: values?.reraregisterednumber || null,
            propertyTypeFlag: schemeType,
            propertySubTypeFlag: propertysubtype,
            address: values?.address,
            numberOfWings: values?.numberofWings,
            description: values?.description ? values?.description : null,
            userId: userId,
            pincode: values?.pincode
        })
        try {
            const result = await postAPI('/add-property-details', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    Cookies.set('propertyId', 1, { expires: 1, secure: true, sameSite: 'Strict' });
                    setShowAlerts(<AlertComp show={true} variant="success" message="Property Added Successfully." />);
                    setTimeout(() => {
                        setLoading(false);
                        setShowAlerts(<AlertComp show={false} />);
                        navigate("/dashboard");
                    }, 2500);
                }
                else {
                    setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs?.msg} />);
                    setTimeout(() => {
                        setLoading(false);
                        setShowAlerts(<AlertComp show={false} />);
                    }, 2000);
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    return (
        <div className='content-area h-100vh'>
            {showAlerts}
            {loading ? <ShowLoader /> : <HideLoader />}
            <div className="row p-4">
                <div className='col-md-8 offset-md-2'>
                    <h4 className='heading'>{schemeType == 1 ? 'Commercial!' : 'Residentials!'}</h4>
                    <p className='font-16 text-white fw-normal'>Heyy, please fill all the informations to proceed further.</p>
                    <Formik initialValues={commercialDetails}
                        validationSchema={PropertiesValidationSchema}
                        onSubmit={(values) => {
                            setCommercialDetails(values);
                            submitCommercialDetails(values);
                        }}>
                        {({ setFieldValue }) => (
                            <Form className='pt-4 mt-2' onKeyDown={(e) => {
                                if (e.key == 'Enter') {
                                    e.preventDefault();
                                }
                            }}>
                                <div className="row">
                                    <div className='col-md-6 position-relative mb-4'>
                                        <label className='custom-label'>Name on Property <span className='text-danger'>*</span></label>
                                        <Field type="text" className="customInput" name='propertyname' autoComplete='off' />
                                        <ErrorMessage name='propertyname' component="div" className="text-start errorText" />
                                    </div>
                                    <div className='col-md-6 position-relative mb-4'>
                                        <label className='custom-label'>Rera registered number</label>
                                        <Field type="text" className="customInput" name='reraregisterednumber' autoComplete='off' />
                                    </div>
                                </div>
                                <div className='position-relative mb-5'>
                                    <label className='fw-semibold text-white' style={{ fontSize: '14px' }}>Property Type <span className='text-danger'>*</span></label>
                                    <div className="d-flex flex-wrap mt-2" style={{ gap: '10px' }}>
                                        {propertyTypeArray?.map((subProperty) => (
                                            <div key={subProperty.id} className={`${selectedPropertySubType == subProperty.id ? 'subPropertyTypeActive' : 'subPropertyTypesBtn'} cursor-pointer`} onClick={() => { setSelectedPropertySubType(subProperty.id); setFieldValue('propertySubTypeFlag', subProperty?.id) }}>
                                                {subProperty.name}
                                            </div>
                                        ))}
                                    </div>
                                    <Field type="hidden" name="propertysubtype" value={selectedPropertySubType} />
                                    <ErrorMessage name="propertysubtype" component="div" className="text-start errorText" />
                                </div>
                                <div className="row">
                                    <div className='col-md-6 position-relative mb-5'>
                                        <label className='custom-label'>Address <span className='text-danger'>*</span></label>
                                        <Field as="textarea" className="customInput" name='address' autoComplete='off' rows="4" />
                                        <ErrorMessage name='address' component="div" className="text-start errorText" />
                                    </div>
                                    <div className='col-md-6 position-relative mb-3'>
                                        <label className='custom-label'>Property Description</label>
                                        <Field as="textarea" className="customInput" name='description' autoComplete='off' rows="4" />
                                    </div>

                                    <div className='col-md-6 position-relative mb-4'>
                                        <label className='custom-label'>Pincode <span className='text-danger'>*</span></label>
                                        <Field type="text" className="customInput" name='pincode' autoComplete='off' />
                                        <ErrorMessage name='pincode' component="div" className="text-start errorText" />
                                    </div>
                                    <div className='col-md-6 position-relative mb-4'>
                                        <label className='custom-label'>Number of Wings / Blocks <span className='text-danger'>*</span></label>
                                        <Field type="number" className="customInput" name='numberofWings' autoComplete='off' min={0} />
                                        <ErrorMessage name='numberofWings' component="div" className="text-start errorText" />
                                    </div>
                                </div>

                                <div className='mt-1 text-end'>
                                    <button type="submit" className='otpBtn'>Continue</button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}
