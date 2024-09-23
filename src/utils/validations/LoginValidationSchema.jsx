import * as Yup from 'yup';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const LoginValidationSchema = Yup.object({
    email: Yup.string()
        .matches(emailRegex, 'Invalid email address.')
        .required('Email is required.'),
    username: Yup.string().required('Username is required.'),
});

export default LoginValidationSchema;
