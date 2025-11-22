import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// Custom hook for role-based access
export const useAuthRole = (requiredRoles = []) => {
  const { user, isAuthenticated } = useAuth();
  
  const hasRole = (role) => {
    return user?.roles?.includes(role) || user?.role === role;
  };
  
  const hasAnyRole = () => {
    if (requiredRoles.length === 0) return true;
    return requiredRoles.some(role => hasRole(role));
  };
  
  const hasAllRoles = () => {
    if (requiredRoles.length === 0) return true;
    return requiredRoles.every(role => hasRole(role));
  };
  
  return {
    user,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    canAccess: isAuthenticated && hasAnyRole()
  };
};

// Custom hook for permission-based access
export const useAuthPermission = (requiredPermissions = []) => {
  const { user, isAuthenticated } = useAuth();
  
  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission);
  };
  
  const hasAnyPermission = () => {
    if (requiredPermissions.length === 0) return true;
    return requiredPermissions.some(permission => hasPermission(permission));
  };
  
  const hasAllPermissions = () => {
    if (requiredPermissions.length === 0) return true;
    return requiredPermissions.every(permission => hasPermission(permission));
  };
  
  return {
    user,
    isAuthenticated,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess: isAuthenticated && hasAnyPermission()
  };
};