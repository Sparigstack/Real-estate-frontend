import * as Yup from 'yup';
export const CustomFieldValidationSchema = (flag) => {
    return Yup.object().shape({
        fieldname: Yup.string().required('Field Name is required'),
        fieldtype: Yup.string().required('Field Type is required'),
    })
};

export default CustomFieldValidationSchema;
