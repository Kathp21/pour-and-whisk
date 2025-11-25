import  {useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })
            if (!response.ok) {
                throw new Error('Failed to login')
            }
            const data = await response.json()
            localStorage.setItem('adminToken', data.token)
            navigate('/admin/menu')
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred')
        }
    }


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-lg w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold mb-2">Admin Login</h1>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-2 rounded">
          Log In
        </button>
      </form>
    </div>
  )
}