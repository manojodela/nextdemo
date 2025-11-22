import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeApi = useCallback(async (apiCall, options = {}) => {
    const { 
      showLoading = true, 
      showSuccessToast = true, 
      showErrorToast = true,
      successMessage = 'Operation completed successfully!'
    } = options;

    try {
      if (showLoading) setLoading(true);
      setError(null);

      const result = await apiCall();
      
      if (result.error) {
        setError(result.error);
        if (showErrorToast) {
          toast.error(result.error.message || 'An error occurred');
        }
        return { success: false, data: null, error: result.error };
      }

      if (showSuccessToast) {
        toast.success(successMessage);
      }
      
      return { success: true, data: result.data, error: null };
    } catch (err) {
      const error = { message: err.message || 'Unexpected error occurred' };
      setError(error);
      if (showErrorToast) {
        toast.error(error.message);
      }
      return { success: false, data: null, error };
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  return { loading, error, executeApi };
};