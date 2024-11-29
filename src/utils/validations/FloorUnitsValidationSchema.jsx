import * as Yup from 'yup';

export const FloorUnitsValidationSchema = (unitFlag) => {
    return Yup.object().shape({
        // Validation for total floors
        totalFloors: Yup.number()
            .required('No. of floors is required')
            .positive('Must be greater than 0')
            .integer('Must be an integer')
            .nullable(),
        unitFlag: Yup.number()
            .oneOf([0, 1], 'You must select either Yes or No for same number of units on each floor')
            .required('Selection is required'),

        ...(unitFlag == 1
            ? {
                unitsFloorWise: Yup.number()
                    .required('No. of units per floor is required')
                    .positive('Must be greater than 0')
                    .integer('Must be an integer')
                    .nullable(),
            }
            : unitFlag == 0
                ? {
                    unitsArray: Yup.array()
                        .of(
                            Yup.object().shape({
                                unitCount: Yup.number()
                                    .required('Unit is required')
                                    .positive('Must be greater than 0')
                                    .integer('Must be an integer'),
                            })
                        )
                        .required('Units per floor are required')
                        .min(1, 'At least one floor is required'),
                }
                : {})
    });
};
