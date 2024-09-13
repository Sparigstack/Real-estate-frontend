import * as Yup from 'yup';

const CommercialValidationSchema = Yup.object({
    propertyName: Yup.string().required('Property Name is required'),
    propertySubTypeFlag: Yup.string().required('Please select a Property Type'),
    reraRegisteredNumber: Yup.string().required('Rera registered number is required'),
    address: Yup.string().required('Address is required'),
    pincode: Yup.string().required('Pincode is required').matches(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits'),
    numberofWings:Yup.string().required('Number of Wings is required'),
    minPrice: Yup.number().required('Minimum Price is required').typeError('Minimum Price must be a number').positive('Minimum Price must be a positive number'),
    maxPrice: Yup.number().required('Maximum Price is required').typeError('Maximum Price must be a number').positive('Maximum Price must be a positive number').moreThan(Yup.ref('minPrice'), 'Maximum Price must be greater than Minimum Price'),
})
export default CommercialValidationSchema;