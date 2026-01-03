import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        const token = localStorage.getItem('token')

        if (!token || !savedUser) {
            navigate('/login')
        } else {
            setUser(JSON.parse(savedUser))
        }
    }, [navigate])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    if (!user) return null

    return (
        <div className="luxury-card">
            <h1 className="luxury-title">Welcome</h1>
            <div className="profile-display">
                {user.profile_photo && (
                    <div className="photo-preview" style={{ margin: '0 auto 20px' }}>
                        <img src={user.profile_photo} alt="Profile" />
                    </div>
                )}
                <p className="luxury-subtitle" style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
                    {user.first_name} {user.last_name}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '30px' }}>{user.email}</p>
            </div>

            <button onClick={handleLogout} className="btn-luxury" style={{ backgroundColor: '#ff4b2b' }}>
                Logout
            </button>
        </div>
    )
}

export default Home
