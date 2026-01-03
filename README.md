# 🌍 GlobeTrotter - Travel Planning Platform

**Empowering Personalized Travel Planning**

A modern, full-stack web application for planning multi-city trips, building day-wise itineraries, managing budgets, and sharing travel plans.

## ✨ Features

### 🔐 User Authentication
- Secure signup/login with bcrypt password hashing
- User profile management
- Session persistence

### 🗺️ Trip Management
- Create and manage multiple trips
- Multi-city itinerary planning
- Date range selection
- Trip descriptions and cover images
- Filter trips (upcoming/past/all)

### 📍 Destination Discovery
- Browse recommended cities worldwide
- Search by city or country
- Filter by region
- Cost index and popularity ratings

### 📅 Itinerary Building
- Add destinations to trips
- Day-wise activity planning
- Activity details (time, duration, cost, type)
- List and timeline views

### 💰 Budget Tracking
- Track expenses by category:
  - Transport
  - Accommodation
  - Activities
  - Food
- Visualbudget breakdowns
- Per-destination budgets

### 🔗 Trip Sharing
- Make trips public
- Shareable links
- Read-only public views

### 👤 User Profiles
- Customizable profile photos (emoji avatars)
- Preferences (currency, language, privacy)
- Account management

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **React Router** - Navigation
- **Vite** - Build tool
- **Vanilla CSS** - Custom design system

### Backend
- **Flask** - Python web framework
- **MongoDB** - Database
- **Flask-CORS** - Cross-origin support
- **bcrypt** - Password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Python 3.8+
- MongoDB running locally

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install flask flask-cors pymongo bcrypt

# Run server
python app.py
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📱 Screen Flow

1. **Login/Signup** - User authentication
2. **Dashboard** - Overview with stats and quick actions
3. **My Trips** - Trip list with filtering
4. **Create Trip** - Initialize new trips
5. **Trip View** - Full itinerary display
6. **Discover** - City and destination search
7. **Profile** - User settings and preferences

## 🎨 Design Features

- **Modern UI** - Clean, travel-inspired design
- **Gradient Accents** - Eye-catching color schemes
- **Card-based Layouts** - Organized content presentation
- **Responsive Design** - Mobile-first approach
- **Smooth Animations** - Fade-in and transition effects
- **Emoji Icons** - Fun, lightweight iconography

## 🌐 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### User Management
- `GET /api/user/:id` - Get user profile
- `PUT /api/user/:id` - Update user profile

### Trips
- `POST /api/trips` - Create trip
- `GET /api/trips/user/:userId` - Get user's trips
- `GET /api/trips/:id` - Get single trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Destinations & Activities
- `POST /api/destinations/add` - Add destination
- `GET /api/cities/search` - Search cities
- `GET /api/activities/search` - Search activities
- `POST /api/activities/add` - Add activity

### Sharing
- `POST /api/trips/:id/share` - Make trip public
- `GET /api/shared/:id` - Get public trip

### Budget
- `GET /api/trips/:id/budget` - Get trip budget

## 🎯 Future Enhancements

- [ ] Collaborative trip planning
- [ ] Real-time weather integration
- [ ] Flight and hotel booking integration
- [ ] Interactive maps (Google Maps API)
- [ ] Budget alerts and recommendations
- [ ] Social features (follow users, copy trips)
- [ ] Mobile app (React Native)
- [ ] Multi-currency support
- [ ] Offline mode with PWA
- [ ] AI-powered itinerary suggestions

## 📄 License

This project is open source and available for educational and personal use.

## 👨‍💻 Development

Built with ❤️ for hackathons and travel enthusiasts worldwide.

---

**Start planning your dream trip today! ✈️🌍**
