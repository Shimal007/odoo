import { useState, useRef } from 'react'
import './index.css'

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    password: '',
    additional_info: '',
    profile_photo: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profile_photo: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const endpoint = isLogin ? '/api/login' : '/api/register'
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      if (isLogin) {
        setSuccess(`Welcome back, ${data.user.first_name}!`)
        // Handle login success (e.g., store token, redirect)
      } else {
        setSuccess('Registration successful! Please login.')
        setIsLogin(true)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="luxury-card">
      <h1 className="luxury-title">classic luxury</h1>
      <p className="luxury-subtitle">Digital Travel Presence</p>

      <form onSubmit={handleSubmit}>
        <div className="photo-upload-container">
          <div className="photo-preview" onClick={() => fileInputRef.current.click()}>
            {formData.profile_photo ? (
              <img src={formData.profile_photo} alt="Profile" />
            ) : (
              <div className="photo-placeholder">+</div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
            accept="image/*"
          />
          <label>Profile Photo</label>
        </div>

        {!isLogin && (
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required={!isLogin}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                required={!isLogin}
              />
            </div>
          </div>
        )}

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

        {!isLogin && (
          <>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required={!isLogin}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required={!isLogin}
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required={!isLogin}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Additional Information</label>
              <textarea
                name="additional_info"
                value={formData.additional_info}
                onChange={handleInputChange}
                rows="3"
              />
            </div>
          </>
        )}

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
          {isLogin ? 'Login' : 'Register User'}
        </button>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <p className="toggle-link">
          {isLogin
            ? "Don't have an account? "
            : "Already have an account? "}
          <span onClick={() => {
            setIsLogin(!isLogin)
            setError('')
            setSuccess('')
          }}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </form>
    </div>
  )
}

export default App
