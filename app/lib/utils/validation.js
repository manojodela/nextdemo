import * as yup from 'yup';

export const userValidationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters'),
  
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters'),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  
  age: yup
    .number()
    .required('Age is required')
    .min(18, 'You must be at least 18 years old')
    .max(100, 'Age cannot exceed 100'),
  
  country: yup
    .string()
    .required('Please select a country'),
  
  gender: yup
    .string()
    .required('Please select a gender')
    .oneOf(['male', 'female', 'other'], 'Please select a valid gender'),
  
  hobbies: yup
    .array()
    .min(1, 'Please select at least one hobby'),
  
  bio: yup
    .string()
    .max(500, 'Bio cannot exceed 500 characters'),
  
  dateOfBirth: yup
    .date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future'),
  
  newsletter: yup.boolean(),
  
  experienceLevel: yup
    .number()
    .min(1, 'Experience level must be at least 1')
    .max(10, 'Experience level cannot exceed 10')
});