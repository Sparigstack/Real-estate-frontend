import React, { useContext, useRef, useState } from 'react'
import { Field, Formik, Form, ErrorMessage } from 'formik'
import { CommercialContext } from '../../../context/CommercialContext';
import UnitsValidationSchema from '../../../utils/validations/UnitsValidationSchema';
import AlertComp from '../../../components/AlertComp';
import useApiService from '../../../services/ApiService';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

export default function UnitDetails({ setWingStep, setCurrentStep, currentStep, totalSteps }) {
  const { unitDetails, utils, setLoading, setShowAlerts } = useContext(CommercialContext);
  const [sameUnitSizeFlag, setSameUnitSizeFlag] = useState(null);
  const { postAPI } = useApiService();
  const navigate = useNavigate();

  const submitUnitDetails = async (values) => {
    setLoading(true);
    const floorUnitDetailsArray = utils.floorUnitDetails.map(floor => ({
      floorId: floor?.floorId,
      unitDetails: floor?.unitDetails.map(unit => ({
        unitId: unit?.unitId,
        unitSize: sameUnitSizeFlag == 1 ? values?.unitSize : values[`unitSizeEachFloor${unit.unitId}`],
        unitPrice: sameUnitSizeFlag == 1 ? values?.unitPrice : values[`eachUnitPrice${unit.unitId}`]
      }))
    }))
    var raw = JSON.stringify({
      unitStartNumber: values?.startingNumber,
      floorUnitDetails: floorUnitDetailsArray
    })
    console.log(raw);
    // try {
    //   const result = await postAPI('/add-unit-details', raw);
    //   if (!result || result == "") {
    //     alert('Something went wrong');
    //   } else {
    //     const responseRs = JSON.parse(result);
    //     if (responseRs.status == 'success') {
    //       setShowAlerts(<AlertComp show={true} variant="success" message="Unit details added successfully." />);
    //       if (totalSteps == currentStep) {
    //         setTimeout(() => {
    //           setLoading(false);
    //           setShowAlerts(<AlertComp show={false} />);
    //           navigate("/commercial-view")
    //         }, 2000);
    //       } else {
    //         setCurrentStep(currentStep + 1);
    //         setTimeout(() => {
    //           setLoading(false);
    //           setShowAlerts(<AlertComp show={false} />);
    //           setWingStep(4);
    //         }, 2000);
    //       }
    //     }
    //     else {
    //       setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs?.msg} />);
    //       setTimeout(() => {
    //         setLoading(false);
    //         setShowAlerts(<AlertComp show={false} />);
    //       }, 2000);
    //     }
    //   }
    // }
    // catch (error) {
    //   console.error(error);
    // }
  }


  return (
    <>
      <div className="row p-4">
        <div className='col-md-6 offset-md-3'>
          <div className='text-center'>
            <h4 className='heading pt-3 mb-3'>Add Unit Details</h4>
          </div>
          <Formik initialValues={{
            unitSizeFlag: sameUnitSizeFlag, unitSize: unitDetails?.unitSize, startingNumber: unitDetails?.startingNumber, unitPrice: unitDetails?.unitPrice, ...utils.floorUnitDetails?.reduce((acc, floor) => {
              floor.unitDetails.forEach((unit) => {
                acc[`unitSizeEachFloor${unit.unitId}`] = '';
                acc[`eachUnitPrice${unit?.unitId}`] = ''
              });
              return acc;
            }, {}),
          }} validationSchema={(e) => UnitsValidationSchema(sameUnitSizeFlag, utils.floorUnitDetails)} onSubmit={submitUnitDetails} >
            {({ setFieldValue }) => {
              const handleSameUnitSizeChange = (value) => {
                setSameUnitSizeFlag(value);
                setFieldValue('unitSizeFlag', value);
                if (value == 1) {
                  utils.floorUnitDetails.forEach(floor => {
                    floor.unitDetails.forEach(unit => {
                      setFieldValue(`unitSizeEachFloor${unit.unitId}`, '');
                      setFieldValue(`eachUnitPrice${unit?.unitId}`, '');
                    });
                  });
                } else {
                  setFieldValue('unitSize', '');
                  setFieldValue('unitPrice','');
                }
              };
              const handleAutofill = (value, floorIndex, fieldType) => {
                const currentFloor = utils.floorUnitDetails[floorIndex];
                currentFloor?.unitDetails.forEach((unit => {
                  if(fieldType == 'size') {
                    setFieldValue(`unitSizeEachFloor${unit?.unitId}`, value)
                  }
                  else{
                    setFieldValue(`eachUnitPrice${unit?.unitId}`,value)
                  }
                 
                }));
              };
              return (
                <Form>
                  <div className='position-relative mb-5'>
                    <label className='fw-semibold text-white' style={{ fontSize: '14px' }}>Is there same unit size on each Floor? <span className='text-danger'>*</span></label>
                    <div className="d-flex flex-wrap mt-2" style={{ gap: '20px' }}>
                      <div className={`${sameUnitSizeFlag == 1 ? 'subPropertyTypeActive' : 'subPropertyTypesBtn'} cursor-pointer`} onClick={() => handleSameUnitSizeChange(1)}>Yes</div>
                      <div className={`${sameUnitSizeFlag == 0 ? 'subPropertyTypeActive' : 'subPropertyTypesBtn'} cursor-pointer`} onClick={() => handleSameUnitSizeChange(0)}>No</div>
                    </div>
                    <Field type="hidden" name="unitSizeFlag" value={sameUnitSizeFlag} />
                    <ErrorMessage name="unitSizeFlag" component="div" className="text-start errorText" />
                  </div>
                  <div className='position-relative mb-5'>
                    <label className='custom-label'>Preferrable Starting Number <span className='text-danger'>*</span></label>
                    <Field type="number" className="customInput" name='startingNumber' autoComplete='off' min={0}/>
                    <ErrorMessage name='startingNumber' component="div" className="text-start errorText" />
                  </div>
                  {sameUnitSizeFlag == 1 && (
                    <>
                      <div className='position-relative mb-5'>
                        <label className='fw-semibold text-white custom-label' style={{ fontSize: '14px' }}>Enter Unit Size <span className='text-danger'>*</span></label>
                        <div className="input-group flex-nowrap">
                          <Field type="number" className="customInput" name='unitSize' autoComplete='off' />
                          <span className="input-group-text" style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>sq feet</span>
                          <ErrorMessage name='unitSize' component="div" className="text-start errorText" style={{ top: "50px" }} />
                        </div>
                      </div>
                      <div className='position-relative mb-5'>
                        <label className='fw-semibold text-white custom-label' style={{ fontSize: '14px',left:'46px' }}>Enter Price <span className='text-danger'>*</span></label>
                        <div className="input-group flex-nowrap position-relative">
                          <span className="input-group-text"><FontAwesomeIcon icon={faIndianRupeeSign} /></span>
                          <Field type="number" className="customInput" name='unitPrice' autoComplete='off' style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }} />
                          <ErrorMessage name='unitPrice' component="div" className="text-start errorText" style={{ top: "50px" }} />
                        </div>
                      </div>
                    </>
                  )}
                  {sameUnitSizeFlag == 0 && (
                    <>
                      <div className="row">
                        {utils.floorUnitDetails?.map((floor, floorIndex) => (
                          <>
                            <div className="col-md-4">
                              <div className='mb-3'>
                                <strong>Floor {floorIndex + 1}</strong>
                              </div>
                            </div>
                            <div className="col-md-8">
                              {/* <div className='d-flex flex-wrap gap-4'> */}
                                {floor?.unitDetails.map((unit, unitIndex) => (
                                  <div key={unit.unitId} className="unit-container position-relative mb-4">
                                    <label className="">
                                      Unit {unitIndex + 1} <span className="text-danger">*</span>
                                    </label>
                                    <Field type="number" className="customInput" name={`unitSizeEachFloor${unit.unitId}`} autoComplete="off"
                                      placeholder="sq feet" onChange={(e) => {
                                        const value = e.target.value;
                                        setFieldValue(`unitSizeEachFloor${unit.unitId}`, value);
                                        if (unitIndex == 0) {
                                          handleAutofill(value, floorIndex, 'size'); // Autofill based on the current floor
                                        }
                                      }}
                                      style={{ transition: 'opacity 0.3s ease' }} />
                                    <ErrorMessage name={`unitSizeEachFloor${unit.unitId}`} component="div" className="text-start errorText" style={{ top: '48px' }} />
                                    <Field type="number" className="customInput" name={`eachUnitPrice${unit.unitId}`} autoComplete="off"
                                       onChange={(e) => {
                                        const value = e.target.value;
                                        setFieldValue(`eachUnitPrice${unit.unitId}`, value);
                                        if (unitIndex == 0) {
                                          handleAutofill(value, floorIndex, 'price'); 
                                        }
                                      }}
                                      style={{ transition: 'opacity 0.3s ease' }} />
                                    <ErrorMessage name={`eachUnitPrice${unit.unitId}`} component="div" className="text-start errorText" style={{ top: '48px' }} />
                                  </div>
                                ))}
                              </div>
                            {/* </div> */}
                          </>
                        ))}
                      </div>
                    </>
                  )}
                  <div className='mt-4 text-end'>
                    <button type="submit" className='otpBtn'>Save</button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  )
}
