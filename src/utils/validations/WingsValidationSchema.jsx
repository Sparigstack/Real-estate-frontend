import * as Yup from 'yup';

export const WingsValidationSchema = (totalWings) => {
    return Yup.object().shape({
        totalWings: Yup.number()
            .required('No. of wings is required')
            .positive('Must be greater than 0')
            .integer('Must be an integer')
            .max(25, 'Cannot exceed 25 wings')
            .nullable(),
        ...(totalWings > 0 && {
            wingsArray: Yup.array()
                .of(
                    Yup.object().shape({
                        wingName: Yup.string().required('Wing name is required')
                    })
                )
        }),

    });
}
