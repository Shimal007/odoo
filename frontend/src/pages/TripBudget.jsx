import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const TripBudget = ({ user, onLogout }) => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [budgetData, setBudgetData] = useState({
        total: 0,
        transport: 0,
        stay: 0,
        activities: 0,
        food: 0,
        perDay: 0,
        days: 0,
        breakdown: []
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchTripAndBudget();
    }, [tripId, user]);

    const fetchTripAndBudget = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/trips/${tripId}`);
            const data = await response.json();

            if (response.ok) {
                setTrip(data);
                calculateBudget(data);
            } else {
                navigate('/trips');
            }
        } catch (err) {
            console.error('Failed to fetch trip:', err);
            navigate('/trips');
        } finally {
            setLoading(false);
        }
    };

    const calculateBudget = (tripData) => {
        let totalActivities = 0;
        let dailyBreakdown = [];

        // Calculate from destinations and activities
        if (tripData.destinations) {
            tripData.destinations.forEach(dest => {
                if (dest.activities) {
                    dest.activities.forEach(activity => {
                        totalActivities += activity.cost || 0;
                    });
                }
            });
        }

        // Get days
        const start = new Date(tripData.start_date);
        const end = new Date(tripData.end_date);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        // Estimate other costs (in real app, these would be user-inputted)
        const estimatedTransport = days * 20; // $20 per day for local transport
        const estimatedStay = days * 80; // $80 per night accommodation
        const estimatedFood = days * 50; // $50 per day for meals

        const total = totalActivities + estimatedTransport + estimatedStay + estimatedFood;

        // Create daily breakdown
        const perDay = total / days;

        for (let i = 0; i < days; i++) {
            const date = new Date(start);
            date.setDate(date.getDate() + i);

            dailyBreakdown.push({
                day: i + 1,
                date: date.toLocaleDateString(),
                estimated: perDay,
                transport: estimatedTransport / days,
                stay: estimatedStay / days,
                activities: totalActivities / days,
                food: estimatedFood / days
            });
        }

        setBudgetData({
            total,
            transport: estimatedTransport,
            stay: estimatedStay,
            activities: totalActivities,
            food: estimatedFood,
            perDay,
            days,
            breakdown: dailyBreakdown
        });
    };

    const getBudgetAlert = () => {
        const avgPerDay = budgetData.perDay;
        if (avgPerDay > 300) return { text: 'High Budget', class: 'text-error', icon: '⚠️' };
        if (avgPerDay > 150) return { text: 'Moderate Budget', class: 'text-warning', icon: '💰' };
        return { text: 'Budget Friendly', class: 'text-success', icon: '✅' };
    };

    // Simple Pie Chart Component
    const SimplePieChart = ({ data }) => {
        const total = data.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = 0;

        const colors = ['#667eea', '#f59e0b', '#10b981', '#ef4444'];

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2xl)' }}>
                <svg width="200" height="200" viewBox="0 0 200 200">
                    {data.map((item, index) => {
                        const percentage = (item.value / total) * 100;
                        const angle = (percentage / 100) * 360;
                        const startAngle = currentAngle;
                        const endAngle = currentAngle + angle;

                        currentAngle = endAngle;

                        const startRad = (startAngle - 90) * (Math.PI / 180);
                        const endRad = (endAngle - 90) * (Math.PI / 180);

                        const x1 = 100 + 80 * Math.cos(startRad);
                        const y1 = 100 + 80 * Math.sin(startRad);
                        const x2 = 100 + 80 * Math.cos(endRad);
                        const y2 = 100 + 80 * Math.sin(endRad);

                        const largeArc = angle > 180 ? 1 : 0;

                        return (
                            <path
                                key={index}
                                d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                fill={colors[index]}
                                opacity="0.8"
                            />
                        );
                    })}
                    <circle cx="100" cy="100" r="50" fill="var(--bg-card)" />
                </svg>

                <div style={{ flex: 1 }}>
                    {data.map((item, index) => (
                        <div key={index} style={{ marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <div style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '4px',
                                background: colors[index],
                                opacity: 0.8
                            }} />
                            <span className="text-secondary">{item.label}:</span>
                            <span className="font-semibold">${item.value.toFixed(2)}</span>
                            <span className="text-muted">({((item.value / total) * 100).toFixed(1)}%)</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Simple Bar Chart Component
    const SimpleBarChart = ({ data }) => {
        const maxValue = Math.max(...data.map(d => d.value));

        return (
            <div style={{ padding: 'var(--spacing-lg)' }}>
                {data.map((item, index) => {
                    const percentage = (item.value / maxValue) * 100;

                    return (
                        <div key={index} style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xs)' }}>
                                <span className="text-secondary">{item.label}</span>
                                <span className="font-semibold">${item.value.toFixed(2)}</span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '24px',
                                background: 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${percentage}%`,
                                    height: '100%',
                                    background: 'linear-gradient(135deg, var(--sky-gradient-start), var(--sky-gradient-end))',
                                    transition: 'width 0.5s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    paddingRight: '8px',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    fontWeight: 600
                                }}>
                                    {percentage > 20 && `${percentage.toFixed(1)}%`}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="page-wrapper">
                <Navbar user={user} onLogout={onLogout} />
                <div className="content-wrapper">
                    <div className="container text-center">
                        <div className="animate-pulse" style={{ padding: 'var(--spacing-2xl)' }}>
                            Calculating budget...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!trip) return null;

    const alert = getBudgetAlert();
    const chartData = [
        { label: 'Accommodation', value: budgetData.stay },
        { label: 'Food', value: budgetData.food },
        { label: 'Activities', value: budgetData.activities },
        { label: 'Transport', value: budgetData.transport }
    ];

    return (
        <div className="page-wrapper">
            <Navbar user={user} onLogout={onLogout} />

            <div className="content-wrapper">
                <div className="container container-wide">
                    {/* Header */}
                    <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                        <div>
                            <h1>Budget Overview 💰</h1>
                            <p className="text-secondary">{trip.name}</p>
                        </div>
                        <button
                            onClick={() => navigate(`/trips/${tripId}`)}
                            className="btn btn-secondary"
                        >
                            ← Back to Trip
                        </button>
                    </div>

                    {/* Budget Alert */}
                    <div className="card" style={{
                        marginBottom: 'var(--spacing-2xl)',
                        borderLeft: `4px solid ${alert.class === 'text-error' ? 'var(--error)' : alert.class === 'text-warning' ? 'var(--warning)' : 'var(--success)'}`
                    }}>
                        <div className="flex items-center gap-3">
                            <span style={{ fontSize: '2rem' }}>{alert.icon}</span>
                            <div>
                                <h3 className={alert.class}>{alert.text}</h3>
                                <p className="text-secondary">
                                    Average ${budgetData.perDay.toFixed(2)} per day for {budgetData.days} days
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                        <div className="card text-center">
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>💵</div>
                            <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem', color: 'var(--ocean-blue)' }}>
                                ${budgetData.total.toFixed(2)}
                            </h3>
                            <p className="text-secondary">Total Budget</p>
                        </div>

                        <div className="card text-center">
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>🏨</div>
                            <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>${budgetData.stay.toFixed(2)}</h3>
                            <p className="text-secondary">Accommodation</p>
                        </div>

                        <div className="card text-center">
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>🍽️</div>
                            <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>${budgetData.food.toFixed(2)}</h3>
                            <p className="text-secondary">Food & Dining</p>
                        </div>

                        <div className="card text-center">
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>🎯</div>
                            <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>${budgetData.activities.toFixed(2)}</h3>
                            <p className="text-secondary">Activities</p>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-2" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                        {/* Pie Chart */}
                        <div className="card card-elevated">
                            <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Budget Distribution</h3>
                            <SimplePieChart data={chartData} />
                        </div>

                        {/* Bar Chart */}
                        <div className="card card-elevated">
                            <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Category Breakdown</h3>
                            <SimpleBarChart data={chartData} />
                        </div>
                    </div>

                    {/* Daily Breakdown */}
                    <div className="card card-elevated">
                        <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Daily Budget Breakdown</h3>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                fontSize: '0.875rem'
                            }}>
                                <thead>
                                    <tr style={{
                                        background: 'var(--bg-secondary)',
                                        borderBottom: '2px solid var(--border-medium)'
                                    }}>
                                        <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Day</th>
                                        <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Date</th>
                                        <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>Accommodation</th>
                                        <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>Food</th>
                                        <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>Activities</th>
                                        <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>Transport</th>
                                        <th style={{ padding: 'var(--spacing-md)', textAlign: 'right', fontWeight: 600 }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {budgetData.breakdown.map((day, index) => (
                                        <tr key={index} style={{
                                            borderBottom: '1px solid var(--border-light)',
                                            transition: 'background var(--transition-fast)'
                                        }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                            <td style={{ padding: 'var(--spacing-md)' }}>Day {day.day}</td>
                                            <td style={{ padding: 'var(--spacing-md)' }} className="text-secondary">{day.date}</td>
                                            <td style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>${day.stay.toFixed(2)}</td>
                                            <td style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>${day.food.toFixed(2)}</td>
                                            <td style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>${day.activities.toFixed(2)}</td>
                                            <td style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>${day.transport.toFixed(2)}</td>
                                            <td style={{ padding: 'var(--spacing-md)', textAlign: 'right', fontWeight: 600 }}>
                                                ${day.estimated.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}

                                    {/* Total Row */}
                                    <tr style={{
                                        background: 'var(--bg-secondary)',
                                        fontWeight: 600,
                                        borderTop: '2px solid var(--border-medium)'
                                    }}>
                                        <td colSpan="2" style={{ padding: 'var(--spacing-md)' }}>TOTAL</td>
                                        <td style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>${budgetData.stay.toFixed(2)}</td>
                                        <td style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>${budgetData.food.toFixed(2)}</td>
                                        <td style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>${budgetData.activities.toFixed(2)}</td>
                                        <td style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>${budgetData.transport.toFixed(2)}</td>
                                        <td style={{ padding: 'var(--spacing-md)', textAlign: 'right', color: 'var(--ocean-blue)' }}>
                                            ${budgetData.total.toFixed(2)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div style={{
                            marginTop: 'var(--spacing-lg)',
                            padding: 'var(--spacing-md)',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                📊 <strong>Budget Insights:</strong>
                            </p>
                            <ul className="text-secondary" style={{ fontSize: '0.875rem', marginLeft: 'var(--spacing-lg)' }}>
                                <li>Accommodation represents {((budgetData.stay / budgetData.total) * 100).toFixed(1)}% of total budget</li>
                                <li>Average daily spending: ${budgetData.perDay.toFixed(2)}</li>
                                <li>Total trip duration: {budgetData.days} days</li>
                                <li style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
                                    💡 Tip: Consider booking accommodations early for better rates
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripBudget;
