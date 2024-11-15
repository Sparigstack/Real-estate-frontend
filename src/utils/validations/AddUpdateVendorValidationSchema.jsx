import * as Yup from 'yup';

const AddUpdateVendorValidationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    companyName: Yup.string(),
    email: Yup.string().email('Invalid email').required('Email is required'),
    contactNum: Yup.string(),
});


export default AddUpdateVendorValidationSchema;
