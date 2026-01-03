import React, { useState } from 'react';
import { Plus, Calendar, MapPin, Clock, Trash2, GripVertical, Send } from 'lucide-react';

const TravelItineraryBuilder = () => {
    const [stops, setStops] = useState([
        {
            id: 1,
            city: 'Napa Valley',
            country: 'USA',
            startDate: '2024-06-15',
            endDate: '2024-06-18',
            activities: [
                { id: 1, time: '10:00 AM', title: 'Wine Tasting at Opus One', description: 'Premium wine experience' },
                { id: 2, time: '2:00 PM', title: 'Hot Air Balloon Ride', description: 'Scenic valley views' },
            ]
        },
        {
            id: 2,
            city: 'Sonoma',
            country: 'USA',
            startDate: '2024-06-18',
            endDate: '2024-06-20',
            activities: [
                { id: 1, time: '9:00 AM', title: 'Vineyard Tour', description: 'Guided tour with sommelier' },
            ]
        }
    ]);

    const [isAddingStop, setIsAddingStop] = useState(false);
    const [newStop, setNewStop] = useState({
        city: '',
        country: '',
        startDate: '',
        endDate: '',
    });

    const [editingActivity, setEditingActivity] = useState({ stopId: null, activity: null });

    const addStop = () => {
        if (newStop.city && newStop.startDate && newStop.endDate) {
            setStops([...stops, {
                id: Date.now(),
                ...newStop,
                activities: []
            }]);
            setNewStop({ city: '', country: '', startDate: '', endDate: '' });
            setIsAddingStop(false);
        }
    };

    const removeStop = (stopId) => {
        setStops(stops.filter(stop => stop.id !== stopId));
    };

    const addActivity = (stopId) => {
        setEditingActivity({
            stopId,
            activity: { id: Date.now(), time: '', title: '', description: '' }
        });
    };

    const saveActivity = () => {
        if (editingActivity.activity.title && editingActivity.activity.time) {
            setStops(stops.map(stop => {
                if (stop.id === editingActivity.stopId) {
                    const existingActivityIndex = stop.activities.findIndex(
                        a => a.id === editingActivity.activity.id
                    );
                    if (existingActivityIndex >= 0) {
                        const newActivities = [...stop.activities];
                        newActivities[existingActivityIndex] = editingActivity.activity;
                        return { ...stop, activities: newActivities };
                    } else {
                        return { ...stop, activities: [...stop.activities, editingActivity.activity] };
                    }
                }
                return stop;
            }));
            setEditingActivity({ stopId: null, activity: null });
        }
    };

    const removeActivity = (stopId, activityId) => {
        setStops(stops.map(stop => {
            if (stop.id === stopId) {
                return {
                    ...stop,
                    activities: stop.activities.filter(a => a.id !== activityId)
                };
            }
            return stop;
        }));
    };

    const sendToBackend = async () => {
        // Prepare data for backend
        const itineraryData = {
            title: 'My Travel Itinerary',
            stops: stops.map(stop => ({
                city: stop.city,
                country: stop.country,
                startDate: stop.startDate,
                endDate: stop.endDate,
                activities: stop.activities.map(activity => ({
                    time: activity.time,
                    title: activity.title,
                    description: activity.description
                }))
            }))
        };

        console.log('Sending to backend:', itineraryData);

        // Simulate API call
        alert('Itinerary data ready to send!\n\nCheck console for the data structure.');

        // Actual API call would be:
        // const response = await fetch('/api/itinerary', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(itineraryData)
        // });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-stone-50">
            {/* Header */}
            <div className="bg-white border-b border-stone-200">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-serif text-stone-800" style={{ fontFamily: 'Georgia, serif' }}>
                                Classic Luxury
                            </h1>
                            <p className="text-stone-500 text-sm mt-1 tracking-wide">DIGITAL TRAVEL ITINERARY</p>
                        </div>
                        <button
                            onClick={sendToBackend}
                            className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            <Send size={18} />
                            View Plan
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Title Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-serif text-stone-800 mb-2">Itinerary Builder</h2>
                    <p className="text-stone-600">Add cities, dates, and activities for each stop</p>
                </div>

                {/* Stops List */}
                <div className="space-y-6 mb-6">
                    {stops.map((stop, index) => (
                        <div key={stop.id} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                            {/* Stop Header */}
                            <div className="bg-gradient-to-r from-amber-50 to-stone-50 p-6 border-b border-stone-200">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="bg-amber-700 text-white rounded-full w-10 h-10 flex items-center justify-center font-serif text-lg">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-serif text-stone-800">{stop.city}</h3>
                                            {stop.country && (
                                                <p className="text-stone-500 text-sm mt-1">{stop.country}</p>
                                            )}
                                            <div className="flex items-center gap-4 mt-3 text-sm text-stone-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} className="text-amber-700" />
                                                    <span>{new Date(stop.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                </div>
                                                <span>-</span>
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} className="text-amber-700" />
                                                    <span>{new Date(stop.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeStop(stop.id)}
                                        className="text-stone-400 hover:text-red-600 transition-colors p-2"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Activities */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    {stop.activities.map((activity) => (
                                        <div key={activity.id} className="flex items-start gap-4 p-4 bg-stone-50 rounded-lg border border-stone-100">
                                            <div className="flex items-center gap-3 flex-1">
                                                <Clock size={18} className="text-amber-700 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <div className="flex items-baseline gap-3">
                                                        <span className="text-sm font-medium text-stone-700">{activity.time}</span>
                                                        <span className="text-base font-serif text-stone-800">{activity.title}</span>
                                                    </div>
                                                    {activity.description && (
                                                        <p className="text-sm text-stone-600 mt-1">{activity.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeActivity(stop.id, activity.id)}
                                                className="text-stone-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Add Activity Form */}
                                    {editingActivity.stopId === stop.id && (
                                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                                            <div className="space-y-3">
                                                <div className="flex gap-3">
                                                    <input
                                                        type="time"
                                                        value={editingActivity.activity.time}
                                                        onChange={(e) => setEditingActivity({
                                                            ...editingActivity,
                                                            activity: { ...editingActivity.activity, time: e.target.value }
                                                        })}
                                                        className="px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Activity title"
                                                        value={editingActivity.activity.title}
                                                        onChange={(e) => setEditingActivity({
                                                            ...editingActivity,
                                                            activity: { ...editingActivity.activity, title: e.target.value }
                                                        })}
                                                        className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Description (optional)"
                                                    value={editingActivity.activity.description}
                                                    onChange={(e) => setEditingActivity({
                                                        ...editingActivity,
                                                        activity: { ...editingActivity.activity, description: e.target.value }
                                                    })}
                                                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={saveActivity}
                                                        className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
                                                    >
                                                        Save Activity
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingActivity({ stopId: null, activity: null })}
                                                        className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Add Activity Button */}
                                {editingActivity.stopId !== stop.id && (
                                    <button
                                        onClick={() => addActivity(stop.id)}
                                        className="mt-4 flex items-center gap-2 text-amber-700 hover:text-amber-800 text-sm font-medium"
                                    >
                                        <Plus size={18} />
                                        Add Activity
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Stop Section */}
                {isAddingStop ? (
                    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
                        <h3 className="text-lg font-serif text-stone-800 mb-4">Add New Stop</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={newStop.city}
                                    onChange={(e) => setNewStop({ ...newStop, city: e.target.value })}
                                    className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                                <input
                                    type="text"
                                    placeholder="Country"
                                    value={newStop.country}
                                    onChange={(e) => setNewStop({ ...newStop, country: e.target.value })}
                                    className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-stone-600 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        value={newStop.startDate}
                                        onChange={(e) => setNewStop({ ...newStop, startDate: e.target.value })}
                                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-stone-600 mb-2">End Date</label>
                                    <input
                                        type="date"
                                        value={newStop.endDate}
                                        onChange={(e) => setNewStop({ ...newStop, endDate: e.target.value })}
                                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={addStop}
                                    className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
                                >
                                    Add Stop
                                </button>
                                <button
                                    onClick={() => setIsAddingStop(false)}
                                    className="px-6 py-3 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAddingStop(true)}
                        className="w-full py-4 border-2 border-dashed border-stone-300 rounded-xl text-stone-600 hover:border-amber-700 hover:text-amber-700 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                        <Plus size={20} />
                        Add Stop
                    </button>
                )}
            </div>
        </div>
    );
};

export default TravelItineraryBuilder;