import { Field, Formik, Form, ErrorMessage } from 'formik';
import React, { useState } from 'react';

export default function InventoryUsage({handleHide}) {
    // Define the initial form data
    const initialValues = {
        utilizationQty: '',
        date: '',
        purpose: '',
    };

    return (
        <Formik
            initialValues={initialValues}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={(values) => {
           
            }}
        >
            {() => (
                <Form className='row'>
                    <div className="row">
                        <div className="col-md-6 position-relative mb-3">
                            <label className='font-13 fw-medium'>
                                Enter Utilization Quantity <span className='text-danger'>*</span>
                            </label>
                            <Field type="number" name="utilizationQty" className="form-control" min={0} />
                            <ErrorMessage name="utilizationQty" component="div" className="text-start errorText" />
                        </div>
                        <div className="col-md-6 position-relative mb-2">
                            <label className='font-13 fw-medium'>
                                Select Date <span className='text-danger'>*</span>
                            </label>
                            <Field type="date" name="date" className="form-control" />
                            <ErrorMessage name="date" component="div" className="text-start errorText" />
                        </div>
                        <div className="col-md-12 position-relative mb-2">
                            <label className='font-13 fw-medium'>Purpose</label>
                            <Field as="textarea" className="form-control" name="purpose" autoComplete="off" rows="2" />
                        </div>
                    </div>
                    <div className='col-12 pt-2 text-end' style={{ borderTop: "1px solid #dee2e6" }}>
                        <button type='button' className="CancelBtn me-2" onClick={handleHide}>
                            Cancel
                        </button>
                        <button type='submit' className="SuccessBtn">
                            Confirm
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
