export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

export const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

export const saveDraftData = (formData) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userFormDraft', JSON.stringify(formData));
  }
};

export const getDraftData = () => {
  if (typeof window !== 'undefined') {
    const draft = localStorage.getItem('userFormDraft');
    return draft ? JSON.parse(draft) : null;
  }
  return null;
};

export const clearDraftData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userFormDraft');
  }
};