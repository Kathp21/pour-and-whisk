import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL || ''
            const loginUrl = `${apiUrl}/admin/login`
            console.log('Attempting login at:', loginUrl)
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })
            
            if (!response.ok) {
                // Try to get error message from response
                let errorMessage = 'Failed to login'
                try {
                    const errorData = await response.json()
                    errorMessage = errorData.message || errorData.error || `Server error: ${response.status}`
                } catch {
                    errorMessage = `Server error: ${response.status} ${response.statusText}`
                }
                throw new Error(errorMessage)
            }
            
            const data = await response.json()
            if (!data.token) {
                throw new Error('No token received from server')
            }
            localStorage.setItem('adminToken', data.token)
            navigate('/admin/orders')
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('An unexpected error occurred. Please check your connection and try again.')
            }
            console.error('Login error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 md:px-12">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-text-light mb-6 text-center">Admin Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-text-light font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-background-dark border border-text-light/20 rounded-lg text-text-light placeholder-text-light/40 focus:outline-none focus:border-favorites transition-colors"
                            placeholder="admin@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-text-light font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-background-dark border border-text-light/20 rounded-lg text-text-light placeholder-text-light/40 focus:outline-none focus:border-favorites transition-colors"
                            placeholder="••••••••"
                        />
                    </div>
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-button-primary hover:bg-button-primary/90 text-text-light font-semibold py-3 px-6 rounded-lg text-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    )
}

