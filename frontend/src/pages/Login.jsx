import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Login failed')
            }

            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            setSuccess(`Welcome back, ${data.user.first_name}!`)

            // Redirect to home or dashboard after a short delay
            setTimeout(() => navigate('/'), 1500)
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="luxury-card">
            <h1 className="luxury-title">classic luxury</h1>
            <p className="luxury-subtitle">Sign In to Your Account</p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <button type="submit" className="btn-luxury">
                    Login
                </button>

                {error && <p className="error-msg">{error}</p>}
                {success && <p className="success-msg">{success}</p>}

                <p className="toggle-link">
                    Don't have an account?{' '}
                    <Link to="/signup">Sign Up</Link>
                </p>
            </form>
        </div>
    )
}

export default Login
