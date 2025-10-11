import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Box, Spinner, Center } from '@chakra-ui/react'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, userProfile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    )
  }

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  if (!userProfile) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    )
  }

  // Check if user has required role
  if (requiredRole && userProfile.role !== requiredRole && userProfile.role !== 'admin') {
    return <Navigate to="/admin/unauthorized" replace />
  }

  // Check if user is active
  if (!userProfile.active) {
    return <Navigate to="/admin/inactive" replace />
  }

  return children
}

export default ProtectedRoute