import * as Yup from 'yup';

export const VillaBungalowValidationSchema = (yesnoRadio) => {
    return Yup.object().shape({
        totalUnits: Yup.number()
            .required('No. of units is required')
            .positive('Must be greater than 0')
            .integer('Must be an integer')
            .max(25, 'Cannot exceed 25 wings')
            .nullable(),
        ...(yesnoRadio == 1 && {
            unitSize: Yup.number()
                .required('Size is required')
                .positive('Must be greater than 0')
                .integer('Must be an integer')
                .nullable(),
        })
    });
}
