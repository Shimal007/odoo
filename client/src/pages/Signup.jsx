import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        city: '',
        country: ''
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

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const { confirmPassword, ...dataToSend } = formData;

            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/login', { state: { message: 'Registration successful! Please login.' } });
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('Network error. Please check if the server is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container flex items-center justify-center" style={{ minHeight: '100vh', padding: '2rem' }}>
            <div className="card animate-fade-in-up" style={{ maxWidth: '48rem', width: '100%' }}>
                {/* Header */}
                <div className="text-center mb-4">
                    <div className="flex justify-center mb-3">
                        <div className="profile-avatar">
                            🌍
                        </div>
                    </div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Join GlobeTrotter</h1>
                    <p className="text-warm-gray">Start planning your dream adventures</p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit}>
                    {/* Name Fields */}
                    <div className="grid grid-2 gap-3">
                        <div className="form-group">
                            <label htmlFor="first_name" className="form-label">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                className="form-input"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                placeholder="John"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="last_name" className="form-label">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                className="form-input"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                                placeholder="Doe"
                            />
                        </div>
                    </div>

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

                    {/* Phone */}
                    <div className="form-group">
                        <label htmlFor="phone" className="form-label">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="form-input"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 234 567 8900"
                        />
                    </div>

                    {/* Location Fields */}
                    <div className="grid grid-2 gap-3">
                        <div className="form-group">
                            <label htmlFor="city" className="form-label">
                                City
                            </label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                className="form-input"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="New York"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="country" className="form-label">
                                Country
                            </label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                className="form-input"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="USA"
                            />
                        </div>
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-2 gap-3">
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

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-input"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                            />
                        </div>
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
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="mt-4">
                    <div style={{ borderTop: '1px solid rgba(184, 134, 11, 0.2)', margin: '1.5rem 0' }}></div>
                    <p className="text-center text-warm-gray" style={{ fontSize: '0.875rem' }}>
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-gold"
                            style={{ fontWeight: 600, textDecoration: 'none' }}
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
