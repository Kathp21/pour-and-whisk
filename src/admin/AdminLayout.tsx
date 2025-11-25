import { Outlet, NavLink } from "react-router-dom"

export default function AdminLayout() {
    return (
        <div className="min-h-screen flex bg-slate-950 text-slate-50">
          {/* Sidebar */}
          <aside className="w-64 border-r border-slate-800 p-4 space-y-4">
            <h1 className="text-xl font-bold mb-4">Cafe Admin</h1>
    
            <nav className="space-y-2">
              <NavLink to="/admin/orders" className="block px-3 py-2 rounded hover:bg-slate-800">
                Orders
              </NavLink>
              <NavLink to="/admin/menu" className="block px-3 py-2 rounded hover:bg-slate-800">
                Menu
              </NavLink>
            </nav>
          </aside>
    
          {/* Page Content */}
          <main className="flex-1 p-6">
            <Outlet /> {/* This is where admin pages appear */}
          </main>
        </div>
      )
    }