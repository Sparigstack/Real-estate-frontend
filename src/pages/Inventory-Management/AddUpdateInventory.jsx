import { Field, Formik, Form, ErrorMessage } from 'formik';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import AddUpdateInventoryValidationSchema from '../../utils/validations/AddUpdateInventoryValidationSchema';
import useApiService from '../../hooks/useApiService';

export default function AddUpdateInventory({ formData, setFormData, handleAddInventory, handleHide }) {
  const { getAPIAuthKey } = useApiService();
  const [vendors, setVendors] = useState([]);
  const [showReminderQuantity, setShowReminderQuantity] = useState(false);

  useEffect(() => {
    const fetchVendorNames = async () => {
      try {
        const response = await getAPIAuthKey('/fetch-vendor-names');
        const responseRs = JSON.parse(response);
        setVendors(responseRs);
      } catch (error) {
        console.error('Error fetching vendor names:', error);
        setVendors([]);
      }
    };

    fetchVendorNames();
  }, []);

  return (
    <Formik
      initialValues={{ ...formData, setReminder: false }}
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={AddUpdateInventoryValidationSchema}
      onSubmit={(values) => {
        setFormData(values);
        handleAddInventory(values);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className="row">
          <div className="col-md-4 pb-2">
            <label className="font-13">Vendor<span className="text-danger">*</span></label>
            <Field as="select" className="form-control" name="vendorId">
              <option value="">Select a vendor</option>
              {vendors.length > 0 ? (
                vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))
              ) : (
                <option value="">No vendors available</option>
              )}
            </Field>
            <ErrorMessage name="vendorId" component="div" className="text-start errorText" />
          </div>

          <div className="col-md-4 pb-2">
            <label className="font-13">Title<span className="text-danger">*</span></label>
            <Field type="text" className="form-control" name="name" autoComplete="off" />
            <ErrorMessage name="name" component="div" className="text-start errorText" />
          </div>

          <div className="col-md-4 pb-2">
            <label className="font-13">Quantity<span className="text-danger">*</span></label>
            <Field type="number" className="form-control" name="currentstock" autoComplete="off" />
            <ErrorMessage name="currentstock" component="div" className="text-start errorText" />
          </div>

          <div className="col-md-4 pb-2">
            <label className="font-13">Unit Price<span className="text-danger">*</span></label>
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faIndianRupeeSign} className="pe-1 font-13" />
              </span>
              <Field type="number" min={0} className="form-control" name="unitPrice" autoComplete="off" />
            </div>
            <ErrorMessage name="unitPrice" component="div" className="text-start errorText" />
          </div>

          <div className="col-md-4 pb-2">
            <label className="font-13">Set Reminder Quantity?</label>
            <Field
              as="select"
              className="form-control"
              name="setReminder"
              onChange={(e) => {
                const value = e.target.value;
                setShowReminderQuantity(value === 'yes');
                setFieldValue("setReminder", value); // Set value directly to "yes" or "no"
                if (value === 'no') {
                  setFieldValue("minstock", ''); // Clear minstock if "no" is selected
                }
              }}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </Field>

          </div>

          {showReminderQuantity && (
            <div className="col-md-4 pb-2">
              <label className="font-13">Reminder Quantity<span className="text-danger">*</span></label>
              <Field type="number" className="form-control" name="minstock" autoComplete="off" />
              <ErrorMessage name="minstock" component="div" className="text-start errorText" />
            </div>
          )}

          <div className="col-12 pt-2 text-end" style={{ borderTop: "1px solid #dee2e6" }}>
            <button type="button" className="CancelBtn me-2" onClick={handleHide}>
              Cancel
            </button>
            <button type="submit" className="SuccessBtn">
              Confirm
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
