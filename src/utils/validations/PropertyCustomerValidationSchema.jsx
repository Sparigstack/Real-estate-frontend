import * as Yup from 'yup';

const emailRegex = /^(?!.*\.\.)([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

export const PropertyCustomerValidationSchema = () => {
    return Yup.object().shape({
        contact_name: Yup.string().required('Contact Name is required.'),
        contact_number: Yup.number()
            .required('Contact Number is required')
            .positive('Must be greater than 0')
            .integer('Must be an integer')
            .nullable(),
        contact_email: Yup.string()
            .matches(emailRegex, 'Invalid email address.')
            .required('Email is required.'),
        total_amount: Yup.number()
            .required('Total amount is required')
            .positive('Must be greater than 0')
            .integer('Must be an integer')
            .nullable(),
        wing: Yup.number().required('Wing is required').notOneOf([0], 'Please Select a valid Wing'),
        unit: Yup.number().required('Unit is required').notOneOf([0], 'Please Select a valid Unit'),
    });
}
