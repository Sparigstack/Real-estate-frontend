import * as Yup from 'yup';

const WingsValidationSchema = (sameNumOfUnitFlag) => {
  return Yup.object().shape({
    wingName: Yup.string()
      .required('Wing Name is required'),
    
    numberofFloors: Yup.number()
      .required('Number of floors is required')
      .typeError('Number of floors must be a number')
      .positive('Number of floors must be a positive number')
      .integer('Number of floors must be an integer'),
    
    unitFlag: Yup.number()
      .required('Please select Yes or No')
      .oneOf([0, 1], 'Invalid option'),
    
    ...(sameNumOfUnitFlag == 1 && {
      numberofUnits: Yup.number()
        .required('Number of units is required')
        .typeError('Number of units must be a number')
        .positive('Number of units must be a positive number')
        .integer('Number of units must be an integer'),
    })
  });
};

export default WingsValidationSchema;
