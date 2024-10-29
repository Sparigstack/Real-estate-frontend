import { Field, Formik, Form, ErrorMessage } from 'formik';
import React from 'react';
import AddUpdateVendorValidationSchema from '../../utils/validations/AddUpdateVendorValidationSchema';

export default function AddUpdateVendor({ formData, setFormData, handleAddVendor, handleHide }) {
    return (
        <Formik
            initialValues={formData}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={AddUpdateVendorValidationSchema}
            onSubmit={(values) => {
                setFormData(values);
                handleAddVendor(values);
            }}
        >
            {() => (
                <Form className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label font-13">
                            Name <span className="text-danger">*</span>
                        </label>
                        <Field type="text" className="form-control" name="name" autoComplete="off" placeholder="Enter your name" />
                        <ErrorMessage name="name" component="div" className="error-text text-danger mt-1" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label font-13">
                            Company Name <span className="text-danger">*</span>
                        </label>
                        <Field type="text" className="form-control" name="companyName" autoComplete="off" placeholder="Enter your company name" />
                        <ErrorMessage name="companyName" component="div" className="error-text text-danger mt-1" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label font-13">
                            Email <span className="text-danger">*</span>
                        </label>
                        <Field type="email" className="form-control" name="email" autoComplete="off" placeholder="Enter your email" />
                        <ErrorMessage name="email" component="div" className="error-text text-danger mt-1" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label font-13">
                            Contact Number <span className="text-danger">*</span>
                        </label>
                        <Field type="tel" className="form-control" name="contactNum" autoComplete="off" placeholder="Enter your contact number" />
                        <ErrorMessage name="contactNum" component="div" className="error-text text-danger mt-1" />
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
