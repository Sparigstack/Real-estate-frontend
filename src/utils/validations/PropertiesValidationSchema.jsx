import * as Yup from 'yup';

const PropertiesValidationSchema = Yup.object({
    propertyname: Yup.string().required('Property Name is required'),
    propertysubtype: Yup.string().required('Please select a Property Type'),
    address: Yup.string().required('Address is required'),
    pincode: Yup.string().required('Pincode is required').matches(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits'),
    state: Yup.number().required('State is required').notOneOf([0], 'Please Select a valid State'),
    city: Yup.number().required('City is required').notOneOf([0], 'Please select a valid city'), // Assuming '0' is the default 'Select' option
    area: Yup.string().required('Area is required')
})
export default PropertiesValidationSchema;