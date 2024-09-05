import * as Yup from 'yup';

const UserDetailsValidationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    contactNum: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits.').required('Phone number is required.'),
    companyName: Yup.string().required('Company Name is required'),
    companyEmail: Yup.string().email('Invalid email address').required('Email is required.')
})
export default UserDetailsValidationSchema;