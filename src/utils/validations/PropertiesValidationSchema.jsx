import * as Yup from 'yup';

const PropertiesValidationSchema = Yup.object({
    propertyname: Yup.string().required('Property Name is required'),
    propertysubtype: Yup.string().required('Please select a Property Type'),
    address: Yup.string().required('Address is required'),
    pincode: Yup.string().required('Pincode is required').matches(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits')
})
export default PropertiesValidationSchema;