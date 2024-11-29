import * as Yup from 'yup';
export const AddUpdateLeadValidationSchema = () => {
    return Yup.object().shape({
        name: Yup.string().required('Name is required.'),
        contactno: Yup.string()
            .matches(/^[0-9]+$/, 'Contact number must be only digits')
            .length(10, 'Contact number must be exactly 10 digits')
            .required('Contact number is required'),
        source: Yup.string()
            .notOneOf(['0'], 'Please select a valid source')
            .required('Source is required'),
        status: Yup.string()
            .notOneOf(['0'], 'Please select a valid status')
            .required('Status is required'),
    })
};

export default AddUpdateLeadValidationSchema;
