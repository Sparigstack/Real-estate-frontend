import * as Yup from 'yup';

const PropertiesValidationSchema = Yup.object({
    propertyname: Yup.string().required('Property Name is required'),
    propertysubtype: Yup.string().required('Please select a Property Type'),
    address: Yup.string().required('Address is required'),
    pincode: Yup.string().required('Pincode is required').matches(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits'),
    numberofWings: Yup.number().required('Number of Wings is required').typeError('Number of Wings must be a number').positive('Number of Wings must be greater than 0').integer('Number of Wings must be an integer')
})
export default PropertiesValidationSchema;