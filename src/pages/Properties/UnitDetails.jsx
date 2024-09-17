import React, { useContext, useState } from 'react'
import { Field, Formik, Form, ErrorMessage } from 'formik'
import { CommercialContext } from '../../context/CommercialContext';
import UnitsValidationSchema from '../../utils/validations/UnitsValidationSchema';
import ShowLoader from '../../components/loader/ShowLoader';
import HideLoader from '../../components/loader/HideLoader';
import AlertComp from '../../components/AlertComp';
export default function UnitDetails() {
  const { unitDetails, floorUnitDetails } = useContext(CommercialContext);
  const [sameUnitSizeFlag, setSameUnitSizeFlag] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  const submitUnitDetails = async (values) => {
    setLoading(true);
    const floorUnitDetailsArray = floorUnitDetails.map(floor => ({
      floorId: floor?.floorId,
      unitDetails: floor?.unitDetails.map(unit => ({
        unitId: unit?.unitId,
        unitSize: sameUnitSizeFlag == 1 ? values?.unitSize : values[`unitSizeEachFloor${unit.unitId}`]
      }))
    }))
    var raw = JSON.stringify({
      unitStartNumber: values?.startingNumber,
      sameUnitSizeFlag: sameUnitSizeFlag,
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
    //       setTimeout(() => {
    //         setLoading(false);
    //         setShowAlerts(<AlertComp show={false} />);
    //       }, 2000);
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
     {showAlerts}
     {loading ? <ShowLoader /> : <HideLoader />}
    <div className="row p-4">
      <div className='col-md-6 offset-md-3'>
        <div className='text-center'>
          <h4 className='heading pt-3 mb-3'>Add Unit Details</h4>
        </div>
        <Formik initialValues={{
          unitSizeFlag: sameUnitSizeFlag, unitSize: unitDetails?.unitSize, startingNumber: unitDetails?.startingNumber, ...floorUnitDetails?.reduce((acc, floor) => {
            floor.unitDetails.forEach((unit) => {
              acc[`unitSizeEachFloor${unit.unitId}`] = '';
            });
            return acc;
          }, {}),
        }} validationSchema={(e) => UnitsValidationSchema(sameUnitSizeFlag, floorUnitDetails)} onSubmit={submitUnitDetails} >
          {({ setFieldValue }) => {
             const handleSameUnitSizeChange = (value) => {
              setSameUnitSizeFlag(value);
              setFieldValue('unitSizeFlag', value);
        
              if (value == 1) {
                floorUnitDetails.forEach(floor => {
                  floor.unitDetails.forEach(unit => {
                    setFieldValue(`unitSizeEachFloor${unit.unitId}`, '');
                  });
                });
              } else {
                setFieldValue('unitSize', '');
              }
            };
            return (
            <Form>
              <div className='position-relative mb-5'>
                <label className='fw-semibold text-white' style={{ fontSize: '14px' }}>Is there same unit size on each Floor? <span className='text-danger'>*</span></label>
                <div className="d-flex flex-wrap mt-2" style={{ gap: '20px' }}>
                  <div className={`${sameUnitSizeFlag == 1 ? 'subPropertyTypeActive' : 'subPropertyTypesBtn'} cursor-pointer`}  onClick={() => handleSameUnitSizeChange(1)}>Yes</div>
                  <div className={`${sameUnitSizeFlag == 0 ? 'subPropertyTypeActive' : 'subPropertyTypesBtn'} cursor-pointer`}  onClick={() => handleSameUnitSizeChange(0)}>No</div>
                </div>
                <Field type="hidden" name="unitSizeFlag" value={sameUnitSizeFlag} />
                <ErrorMessage name="unitSizeFlag" component="div" className="text-start errorText" />
              </div>
              <div className='position-relative mb-4'>
                <label className='custom-label'>Preferrable Starting Number <span className='text-danger'>*</span></label>
                <Field type="number" className="customInput" name='startingNumber' autoComplete='off' />
                <ErrorMessage name='startingNumber' component="div" className="text-start errorText" />
              </div>
              {sameUnitSizeFlag == 1 && (
                <>
                  <div className='position-relative mb-5'>
                    <label className='fw-semibold text-white' style={{ fontSize: '14px' }}>Enter Unit Size <span className='text-danger'>*</span></label>
                    <div className="input-group flex-nowrap">
                      <Field type="number" className="customInput" name='unitSize' autoComplete='off' />
                      <span className="input-group-text">sq feet</span>
                      <ErrorMessage name='unitSize' component="div" className="text-start errorText" style={{ top: "50px" }} />
                    </div>
                  </div>
                </>
              )}
              {sameUnitSizeFlag == 0 && (
                <div className='custom-accordian'>
                  <div className="accordion" id="accordionExample">
                    {floorUnitDetails?.map((floor, index) => (
                      <div className="accordion-item" key={floor.floorId}>
                        <h2 className="accordion-header">
                          <button className={`accordion-button ${index == 0 ? '' : 'collapsed'}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapseFloor${index}`} aria-expanded={index == 0 ? 'true' : 'false'} aria-controls={`collapseFloor${index}`}>
                            Floor {index + 1}
                          </button>
                        </h2>
                        <div id={`collapseFloor${index}`} className={`accordion-collapse collapse ${index == 0 ? 'show' : ''}`} data-bs-parent="#accordionExample">
                          <div className="accordion-body">
                            <div className='d-flex flex-wrap gap-4'>
                              {floor?.unitDetails.map((unit, index) => (
                                <div key={unit.unitId} className='position-relative mb-2'>
                                  <label className='custom-label'>Unit {index + 1} <span className='text-danger'>*</span></label>
                                  <Field type="number" className="customInput" name={`unitSizeEachFloor${unit.unitId}`} autoComplete='off' placeholder='sq feet' />
                                  <ErrorMessage name={`unitSizeEachFloor${unit.unitId}`} component="div" className="text-start errorText" />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className='mt-4 text-end'>
                <button type="submit" className='otpBtn'>Continue</button>
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
