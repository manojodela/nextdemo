'use client';
import { AuthProvider as AuthContextProvider } from '../../lib/context/AuthContext';

export function AuthProvider({ children }) {
  return (
    <AuthContextProvider>
      {children}
    </AuthContextProvider>
  );
}