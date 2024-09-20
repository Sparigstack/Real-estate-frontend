import * as Yup from 'yup';

const UnitsValidationSchema = (sameUnitSizeFlag, floorUnitDetails) => {
    const unitSizeEachFloorValidation = floorUnitDetails?.reduce((acc, floor) => {
        floor.unitDetails.forEach((unit) => {
          acc[`unitSizeEachFloor${unit.unitId}`] = Yup.number()
            .required('Unit size is required')
            .typeError('Unit size must be a number')
            .positive('Unit size must be a positive number')
            .integer('Unit size must be an integer');
          acc[`eachUnitPrice${unit?.unitId}`] = Yup.number()
          .required('Unit price is required')
          .typeError('Unit price must be a number')
          .positive('Unit price must be a positive number')
          .integer('Unit price must be an integer');
        });
        return acc;
      }, {});
    return Yup.object().shape({
    unitSizeFlag: Yup.number().required('Please select Yes or No').oneOf([0, 1], 'Please select Yes or No'),
    startingNumber: Yup.number().required('Starting number is required').typeError('Starting number must be a number').positive('Starting number must be a positive number').integer('Starting number must be an integer'),

    ...(sameUnitSizeFlag == 1 && {
        unitSize: Yup.number().required('Unit size is required').typeError('Unit size must be a number').positive('Unit size must be a positive number').integer('Unit size must be an integer'),
        unitPrice: Yup.number().required('Unit Price is required').typeError('Unit size must be a number').positive('Unit size must be a positive number').integer('Unit size must be an integer'),
    }),
    ...(sameUnitSizeFlag == 0 && unitSizeEachFloorValidation),
});
};
export default UnitsValidationSchema;