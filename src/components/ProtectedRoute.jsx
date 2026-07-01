import { Navigate } from 'react-router-dom'
import Loading from './Loading'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, role, isLoading } = useAuth()

  if (isLoading) {
    return <Loading />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    const fallback = role === 'Admin' ? '/dashboard/admin/customers' : '/dashboard/member'
    return <Navigate to={fallback} replace />
  }

  return children
}
