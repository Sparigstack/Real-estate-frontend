import * as Yup from 'yup';

export const PropertyBookingValidationSchema = () => {
    return Yup.object().shape({
        contact_name: Yup.string().required('Contact Name is required.'),
        contact_number: Yup.number()
            .required('Contact Number is required')
            .positive('Must be greater than 0')
            .integer('Must be an integer')
            .nullable()
    });
}
