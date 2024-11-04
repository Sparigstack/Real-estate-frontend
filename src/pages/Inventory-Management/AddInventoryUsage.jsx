import { Field, Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import React, { useState } from 'react';

export default function InventoryUsage({ formData, setFormData,AddInventoryUsageData,handleHide }) {
    return (
        <Formik
            initialValues={formData}
            validationSchema={Yup.object({
                utilizationQty: Yup.number()
                    .required('Utilization Quantity is required')
                    .min(1, 'Quantity must be at least 1')
                    .max(formData.maxQuantity, `Maximum available quantity is ${formData.maxQuantity}`),
                date: Yup.date().required('Date is required'),
                note: Yup.string(),
            })}
            validateOnBlur
            validateOnChange
            onSubmit={(values) => {
                setFormData(values);
                AddInventoryUsageData(values); // Wait for the API call to complete
                handleHide();
            }}
        >
            {formikProps => (
                <Form className='row'>
                    <div className="col-md-6 position-relative mb-3">
                        <label className='font-13 fw-medium'>
                            Enter Utilization Quantity <span className='text-danger'>*</span>
                        </label>
                        <Field
                            type="number"
                            name="utilizationQty"
                            className="form-control"
                        />
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
                        <label className='font-13 fw-medium'>Note</label>
                        <Field as="textarea" className="form-control" name="note" autoComplete="off" rows="2" />
                    </div>
                    <div className="col-md-12 position-relative mb-2" style={{ display: 'none' }}>
                    <Field as="textarea" className="form-control" name="inventoryId" value={formData.inventoryId} autoComplete="off" rows="2" />
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