import { Field, Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/purchaseOrder.css'
export default function AddPurchaseOrder({ formData, setFormData, GeneratePo, handleHide }) {
    const navigate = useNavigate();
    const validationSchema = Yup.object().shape({
        price_per_quantity: Yup.number().required('Price per quantity is required'),
        quantity: Yup.number().required('Quantity is required'),
    });

    const handleSubmit = (values) => {
        console.log('Form Submitted:', values);
    };

    const handlePreview = (values) => {
        const total = values.price_per_quantity * values.quantity; // Calculate total
        navigate('/preview-po', { state: { formData: values, total } }); // Navigate to preview page
    };

    return (
        <div className='containerStyle'>
            <div className='headerStyle'>
                <div>
                    <h4 className='text-decoration-underline'>Vendor Details</h4>
                    <p><strong>Name:</strong> {formData?.inventoryDetails?.inventory_log_details?.vendor?.name || 'N/A'}</p>
                    <p><strong>Company:</strong> {formData?.inventoryDetails?.inventory_log_details?.vendor?.company_name || 'N/A'}</p>
                    <p><strong>Email:</strong> {formData?.inventoryDetails?.inventory_log_details?.vendor?.email || 'N/A'}</p>
                    <p><strong>Contact:</strong> {formData?.inventoryDetails?.inventory_log_details?.vendor?.contact || 'N/A'}</p>
                </div>

                <div>
                    <h4 className='text-decoration-underline'>Customer Details</h4>
                    <p><strong>Name:</strong> {formData?.inventoryDetails?.property_details?.user?.name || 'N/A'}</p>
                    <p><strong>Email:</strong> {formData?.inventoryDetails?.property_details?.user?.email || 'N/A'}</p>
                    <p><strong>Contact:</strong> {formData?.inventoryDetails?.property_details?.user?.contact_no || 'N/A'}</p>
                    <p><strong>Property:</strong> {formData?.inventoryDetails?.property_details?.name || 'N/A'}</p>
                </div>
            </div>
            <Formik
                initialValues={{
                    name: formData?.inventoryDetails?.name,
                    price_per_quantity: formData?.inventoryDetails?.price_per_quantity,
                    quantity: 1,
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    const rowData = {
                        inventoryId: formData?.inventoryDetails?.id,
                        vendorId: formData?.inventoryDetails?.inventory_log_details?.vendor?.id,
                        propertyId: formData?.inventoryDetails?.property_details?.id,
                        quantity: values.quantity,
                        price: values.price_per_quantity * values.quantity,
                    };
                    setFormData(values);
                    GeneratePo(rowData);
                }}
            >
                {({ values }) => (
                    <Form>
                        <table className='tableStyle'>
                            <thead>
                                <tr>
                                    <th className='tableHeaderStyle'>Inventory</th>
                                    <th className='tableHeaderStyle'>Price/Quantity</th>
                                    <th className='tableHeaderStyle'>Quantity</th>
                                    <th className='tableHeaderStyle'>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='tableDataStyle'>
                                        <Field type="text" name="name" disabled className='inputStyle' />
                                    </td>
                                    <td className='tableDataStyle'>
                                        <Field type="number" name="price_per_quantity" disabled className='inputStyle' />
                                        <ErrorMessage name="price_per_quantity" component="div" className='inputStyle' />
                                    </td>
                                    <td className='tableDataStyle'>
                                        <Field type="number" name="quantity" className='inputStyle' />
                                        <ErrorMessage name="quantity" component="div" className='inputStyle' />
                                    </td>
                                    <td className='tableDataStyle'>
                                            <span className='rupeeIconStyle'>₹</span>
                                            {values.price_per_quantity * values.quantity || 0}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className='text-end'>
                            <button type='button' className="CancelBtn me-2" onClick={() => handlePreview(values)}>
                                Preview
                            </button>
                            <button type='submit' className="SuccessBtn">
                                Confirm
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

// Styles
