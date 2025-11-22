'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/hooks/useAuth';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  requiredPermissions = [],
  fallback = null,
  redirectTo = '/login'
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Check role-based access
    if (requiredRoles.length > 0) {
      const userRole = user?.role;
      const hasRequiredRole = requiredRoles.includes(userRole) || 
                            requiredRoles.some(role => user?.roles?.includes(role));
      
      if (!hasRequiredRole) {
        setHasAccess(false);
        return;
      }
    }

    // Check permission-based access
    if (requiredPermissions.length > 0) {
      const userPermissions = user?.permissions || [];
      const hasRequiredPermission = requiredPermissions.some(permission => 
        userPermissions.includes(permission)
      );
      
      if (!hasRequiredPermission) {
        setHasAccess(false);
        return;
      }
    }

    setHasAccess(true);
  }, [user, isAuthenticated, isLoading, requiredRoles, requiredPermissions]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect happens in useEffect
  }

  if (!hasAccess) {
    return fallback || (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Higher-order component for route protection
export function withProtectedRoute(Component, options = {}) {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// Role-based protection component
export function RoleProtectedRoute({ 
  children, 
  allowedRoles, 
  fallback 
}) {
  return (
    <ProtectedRoute 
      requiredRoles={allowedRoles} 
      fallback={fallback}
    >
      {children}
    </ProtectedRoute>
  );
}

// Permission-based protection component
export function PermissionProtectedRoute({ 
  children, 
  requiredPermissions, 
  fallback 
}) {
  return (
    <ProtectedRoute 
      requiredPermissions={requiredPermissions} 
      fallback={fallback}
    >
      {children}
    </ProtectedRoute>
  );
}