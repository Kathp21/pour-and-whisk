import RequireAdmin from '../components/RequireAdmin'
import AdminLayout from './AdminLayout'

export default function ProtectedAdminLayout() {
    return (
        <RequireAdmin>
            <AdminLayout />
        </RequireAdmin>
    )
}

