import * as Yup from 'yup';

const LoginValidationSchema = Yup.object({
    username: Yup.string().required('Username is required.'),
    companyname: Yup.string().required('Company Name is required.'),
    otp: Yup.string().length(6).required('OTP is required.'),
});

export default LoginValidationSchema;
