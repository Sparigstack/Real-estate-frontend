import * as Yup from 'yup';

const emailRegex = /^(?!.*\.\.)([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

const AddUpdateLeadValidationSchema = Yup.object({
    name: Yup.string().required('Name is required.'),
    email: Yup.string()
        .matches(emailRegex, 'Invalid email address.')
        .required('Email is required.'),
    contactno: Yup.string()
        .matches(/^[0-9]+$/, 'Contact number must be only digits')
        .min(10, 'Contact number must be at least 10 digits')
        .required('Contact number is required'),
    budget: Yup.number()
        .positive('Budget must be a positive number')
        .min(0)
        .required('Budget is required'),

    source: Yup.string()
        .notOneOf(['0'], 'Please select a valid source')
        .required('Source is required')
});

export default AddUpdateLeadValidationSchema;
