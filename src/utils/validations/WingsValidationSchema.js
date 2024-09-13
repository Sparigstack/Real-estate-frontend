import * as Yup from 'yup';

const WingsValidationSchema = Yup.object({
    wingName: Yup.string().required('Wing Name is required'),
    wingSize: Yup.number().required('Wing Size is required').typeError('Wing Size must be a number').positive('Wing Size must be a positive number'),
    numberofFloors: Yup.number().required('Number of floors is required').typeError('Number of floors must be a number').positive('Number of floors must be a positive number'),
    unitFlag: Yup.string().required('Please select one option'),
})
export default WingsValidationSchema;