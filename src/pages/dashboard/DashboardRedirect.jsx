import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Loading from '../../components/Loading'

export default function DashboardRedirect() {
  const { user, role, isLoading } = useAuth()

  if (isLoading) {
    return <Loading />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role === 'Admin') {
    return <Navigate to="/dashboard/admin/customers" replace />
  }

  return <Navigate to="/dashboard/member" replace />
}
