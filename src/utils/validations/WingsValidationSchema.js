import * as Yup from 'yup';

const WingsValidationSchema = Yup.object({
    wingName: Yup.string().required('Wing Name is required'),
    numberofFloors: Yup.number()
        .required('Number of floors is required')
        .typeError('Number of floors must be a number')
        .positive('Number of floors must be a positive number')
        .integer('Number of floors must be an integer'),
    unitFlag: Yup.number()
        .required('Please select one option')
        .oneOf([0, 1], 'Invalid option'),
});

export default WingsValidationSchema;
