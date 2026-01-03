from extensions import db
from datetime import datetime
import json

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.LargeBinary, nullable=False)
    phone = db.Column(db.String(20))
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))
    profile_photo = db.Column(db.String(500))
    preferences = db.Column(db.Text)  # Store as JSON string
    saved_destinations = db.Column(db.Text)  # Store as JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    trips = db.relationship("Trip", backref="user", cascade="all, delete-orphan", lazy=True)

    def to_dict(self):
        return {
            '_id': str(self.id),
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone or '',
            'city': self.city or '',
            'country': self.country or '',
            'profile_photo': self.profile_photo or '',
            'preferences': json.loads(self.preferences) if self.preferences else {"currency": "USD", "language": "en", "privacy": "public"},
            'saved_destinations': json.loads(self.saved_destinations) if self.saved_destinations else []
        }

class Trip(db.Model):
    __tablename__ = 'trips'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    start_date = db.Column(db.String(20))
    end_date = db.Column(db.String(20))
    cover_image = db.Column(db.String(500))
    destinations = db.Column(db.Text)  # Store as JSON string
    budget = db.Column(db.Text)  # Store as JSON string
    status = db.Column(db.String(50), default='planning')
    visibility = db.Column(db.String(20), default='private')
    ai_generated = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            '_id': str(self.id),
            'user_id': str(self.user_id),
            'name': self.name,
            'description': self.description or '',
            'start_date': self.start_date,
            'end_date': self.end_date,
            'cover_image': self.cover_image or '',
            'destinations': json.loads(self.destinations) if self.destinations else [],
            'budget': json.loads(self.budget) if self.budget else {"total": 0, "transport": 0, "stay": 0, "activities": 0, "food": 0},
            'status': self.status,
            'visibility': self.visibility,
            'ai_generated': self.ai_generated,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
