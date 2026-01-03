import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));
                onLogin(data.user);
                navigate('/dashboard');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please check if the server is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container flex items-center justify-center" style={{ minHeight: '100vh', padding: '2rem' }}>
            <div className="card animate-fade-in-up" style={{ maxWidth: '28rem', width: '100%' }}>
                {/* Header */}
                <div className="text-center mb-4">
                    <div className="flex justify-center mb-3">
                        <div className="profile-avatar">
                            ✈️
                        </div>
                    </div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p className="text-warm-gray">Sign in to continue your travel journey</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn btn-primary w-full mt-4"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="mt-4">
                    <div className="text-center">
                        <Link
                            to="/forgot-password"
                            className="text-gold"
                            style={{ fontSize: '0.875rem', textDecoration: 'none' }}
                        >
                            Forgot your password?
                        </Link>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(184, 134, 11, 0.2)', margin: '1.5rem 0' }}></div>
                    <p className="text-center text-warm-gray" style={{ fontSize: '0.875rem' }}>
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            className="text-gold"
                            style={{ fontWeight: 600, textDecoration: 'none' }}
                        >
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
