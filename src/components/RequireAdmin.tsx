import { Navigate } from 'react-router-dom'

interface RequireAdminProps {
  children: React.ReactNode
}

export default function RequireAdmin({ children }: RequireAdminProps) {
  const adminToken = localStorage.getItem('adminToken')
  
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />
  }
  
  return <>{children}</>
}


