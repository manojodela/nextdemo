"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userValidationSchema } from '../lib/utils/validation';
import { userService } from '../lib/api/services/UserService';
import { useApi } from '../lib/hooks/useAPi';
import LoadingSpinner from './ui/LoadingSpinner';

const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'in', label: 'India' }
];

const HOBBIES = ['Reading', 'Gaming', 'Sports', 'Music', 'Traveling', 'Cooking'];

export default function UserForm() {
  const { loading, executeApi } = useApi();
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields, dirtyFields },
    reset,
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(userValidationSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      age: '',
      country: '',
      gender: '',
      hobbies: [],
      bio: '',
      dateOfBirth: '',
      newsletter: false,
      experienceLevel: 5
    }
  });

  const watchedValues = watch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('profilePicture', file);
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    // Client-side API call
    const clientResult = await executeApi(
      () => userService.createUser(data),
      {
        successMessage: 'User created successfully!',
        showLoading: false
      }
    );

    if (clientResult.success) {
      // Server-side processing will be handled by the API route
      console.log('✅ Client-side submission successful:', clientResult.data);

      // Reset form after successful submission
      reset();
      setPreviewImage(null);

      // Optional: Fetch updated user list
      await executeApi(
        () => userService.getUsers(),
        { showLoading: false, showSuccessToast: false }
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <p className="text-sm text-gray-500">{process.env.NEXT_PUBLIC_SERVICE_ENDPOINT || 'SERVICE_ENDPOINT not set in browser env'}</p>
      <p className="text-sm text-gray-500">{process.env.SERVICE_ENDPOINT || 'Dynamic SERVICE_ENDPOINT not set in browser env'}</p>
      <h2 className="text-2xl font-bold mb-6 text-center">User Registration Form</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Text Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              {...register('firstName')}
              type="text"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              {...register('lastName')}
              type="text"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            {...register('email')}
            type="email"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Number Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age *
          </label>
          <input
            {...register('age')}
            type="number"
            min="18"
            max="100"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.age ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Enter age"
          />
          {errors.age && (
            <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
          )}
        </div>

        {/* Dropdown/Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country *
          </label>
          <select
            {...register('country')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.country ? 'border-red-500' : 'border-gray-300'
              }`}
          >
            <option value="">Select a country</option>
            {COUNTRIES.map(country => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
          )}
        </div>

        {/* Radio Buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <div className="flex space-x-4">
            {['male', 'female', 'other'].map(gender => (
              <label key={gender} className="flex items-center">
                <input
                  {...register('gender')}
                  type="radio"
                  value={gender}
                  className="mr-2"
                />
                <span className="capitalize">{gender}</span>
              </label>
            ))}
          </div>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
          )}
        </div>

        {/* Checkboxes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hobbies (Select multiple)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {HOBBIES.map(hobby => (
              <label key={hobby} className="flex items-center">
                <input
                  {...register('hobbies')}
                  type="checkbox"
                  value={hobby}
                  className="mr-2"
                />
                <span>{hobby}</span>
              </label>
            ))}
          </div>
          {errors.hobbies && (
            <p className="text-red-500 text-sm mt-1">{errors.hobbies.message}</p>
          )}
        </div>

        {/* Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio/Description
          </label>
          <textarea
            {...register('bio')}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.bio ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Tell us about yourself"
          />
          {errors.bio && (
            <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
          )}
        </div>

        {/* Date Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <input
            {...register('dateOfBirth')}
            type="date"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
          )}
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {previewImage && (
            <div className="mt-2">
              <img
                src={previewImage}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-md border"
              />
            </div>
          )}
        </div>

        {/* Toggle/Switch */}
        <div className="flex items-center">
          <input
            {...register('newsletter')}
            type="checkbox"
            className="mr-2 h-4 w-4 text-blue-600"
          />
          <label className="text-sm font-medium text-gray-700">
            Subscribe to newsletter
          </label>
        </div>

        {/* Range Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level: {watchedValues.experienceLevel}
          </label>
          <input
            {...register('experienceLevel')}
            type="range"
            min="1"
            max="10"
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Beginner</span>
            <span>Expert</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading || isSubmitting}
            className={`px-8 py-3 rounded-md font-medium text-white ${loading || isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
          >
            {loading || isSubmitting ? (
              <div className="flex items-center">
                <LoadingSpinner size="sm" />
                <span className="ml-2">Submitting...</span>
              </div>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </form>

      {/* Debug Info (Development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-md">
          <h3 className="font-medium mb-2">Form Debug Info:</h3>
          <p className="text-sm">Touched fields: {Object.keys(touchedFields).join(', ')}</p>
          <p className="text-sm">Dirty fields: {Object.keys(dirtyFields).join(', ')}</p>
          <p className="text-sm">Errors: {Object.keys(errors).join(', ')}</p>
        </div>
      )}
    </div>
  );
}