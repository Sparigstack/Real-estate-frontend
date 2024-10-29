import * as Yup from 'yup';

const AddUpdateInventoryValidationSchema = Yup.object({
    name: Yup.string().required('Name is required.'),
    currentstock: Yup.number()
        .positive('Stock must be a positive number')
        .min(0, 'Stock must be at least 0')
        .required('Current Stock is required'),
    minstock: Yup.number()
        .positive('Minimum Stock must be a positive number')
        .min(0, 'Minimum Stock must be at least 0')
        .required('Minimum Stock is required'),
    unitPrice: Yup.number()
        .min(0, 'Price must be at least 0')
        .required('Price is required'),
});

export default AddUpdateInventoryValidationSchema;
