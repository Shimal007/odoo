from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import bcrypt
from datetime import datetime, timedelta
import json

app = Flask(__name__)
CORS(app)

# ------------------ MongoDB ------------------
client = MongoClient("mongodb://localhost:27017/")
db = client["globetrotter"]
users = db["users"]
trips = db["trips"]
activities = db["activities"]
cities = db["cities"]

# ------------------ Helper Functions ------------------
def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable format"""
    if doc and '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

def serialize_list(docs):
    """Convert list of MongoDB documents"""
    return [serialize_doc(doc) for doc in docs]

# ------------------ USER AUTHENTICATION ------------------

@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    required_fields = ["first_name", "last_name", "email", "password"]
    
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"{field} is required"}), 400
    
    if users.find_one({"email": data["email"]}):
        return jsonify({"error": "User already exists"}), 409
    
    password_bytes = data["password"].encode("utf-8")
    hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    
    user_data = {
        "first_name": data["first_name"],
        "last_name": data["last_name"],
        "email": data["email"],
        "phone": data.get("phone", ""),
        "city": data.get("city", ""),
        "country": data.get("country", ""),
        "profile_photo": data.get("profile_photo", ""),
        "password": hashed_password,
        "preferences": {
            "currency": "USD",
            "language": "en",
            "privacy": "public"
        },
        "saved_destinations": [],
        "created_at": datetime.utcnow()
    }
    
    result = users.insert_one(user_data)
    return jsonify({
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    
    if "email" not in data or "password" not in data:
        return jsonify({"error": "Email and password required"}), 400
    
    user = users.find_one({"email": data["email"]})
    
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401
    
    password_bytes = data["password"].encode("utf-8")
    
    if bcrypt.checkpw(password_bytes, user["password"]):
        return jsonify({
            "message": "Login successful",
            "user": {
                "_id": str(user["_id"]),
                "email": user["email"],
                "first_name": user["first_name"],
                "last_name": user["last_name"],
                "profile_photo": user.get("profile_photo", "")
            }
        }), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

# ------------------ USER PROFILE ------------------

@app.route("/api/user/<user_id>", methods=["GET"])
def get_user(user_id):
    try:
        user = users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        user = serialize_doc(user)
        user.pop('password', None)
        return jsonify(user), 200
    except:
        return jsonify({"error": "Invalid user ID"}), 400

@app.route("/api/user/<user_id>", methods=["PUT"])
def update_user(user_id):
    try:
        data = request.json
        update_fields = {}
        
        allowed_fields = ["first_name", "last_name", "phone", "city", "country", "profile_photo", "preferences"]
        for field in allowed_fields:
            if field in data:
                update_fields[field] = data[field]
        
        if update_fields:
            users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_fields}
            )
        
        return jsonify({"message": "Profile updated successfully"}), 200
    except:
        return jsonify({"error": "Failed to update profile"}), 400

# ------------------ TRIPS MANAGEMENT ------------------

@app.route("/api/trips", methods=["POST"])
def create_trip():
    data = request.json
    required_fields = ["user_id", "name", "start_date", "end_date"]
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400
    
    trip_data = {
        "user_id": data["user_id"],
        "name": data["name"],
        "description": data.get("description", ""),
        "start_date": data["start_date"],
        "end_date": data["end_date"],
        "cover_image": data.get("cover_image", ""),
        "destinations": [],
        "budget": {
            "total": 0,
            "transport": 0,
            "stay": 0,
            "activities": 0,
            "food": 0
        },
        "status": "planning",
        "visibility": "private",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = trips.insert_one(trip_data)
    trip_data["_id"] = str(result.inserted_id)
    
    return jsonify({
        "message": "Trip created successfully",
        "trip": serialize_doc(trip_data)
    }), 201

@app.route("/api/trips/user/<user_id>", methods=["GET"])
def get_user_trips(user_id):
    try:
        user_trips = list(trips.find({"user_id": user_id}).sort("created_at", -1))
        return jsonify(serialize_list(user_trips)), 200
    except:
        return jsonify({"error": "Failed to fetch trips"}), 400

@app.route("/api/trips/<trip_id>", methods=["GET"])
def get_trip(trip_id):
    try:
        trip = trips.find_one({"_id": ObjectId(trip_id)})
        if not trip:
            return jsonify({"error": "Trip not found"}), 404
        
        return jsonify(serialize_doc(trip)), 200
    except:
        return jsonify({"error": "Invalid trip ID"}), 400

@app.route("/api/trips/<trip_id>", methods=["PUT"])
def update_trip(trip_id):
    try:
        data = request.json
        data["updated_at"] = datetime.utcnow()
        
        trips.update_one(
            {"_id": ObjectId(trip_id)},
            {"$set": data}
        )
        
        return jsonify({"message": "Trip updated successfully"}), 200
    except:
        return jsonify({"error": "Failed to update trip"}), 400

@app.route("/api/trips/<trip_id>", methods=["DELETE"])
def delete_trip(trip_id):
    try:
        result = trips.delete_one({"_id": ObjectId(trip_id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Trip not found"}), 404
        
        return jsonify({"message": "Trip deleted successfully"}), 200
    except:
        return jsonify({"error": "Failed to delete trip"}), 400

# ------------------ DESTINATIONS / CITIES ------------------

@app.route("/api/destinations/add", methods=["POST"])
def add_destination():
    try:
        data = request.json
        trip_id = data.get("trip_id")
        destination = {
            "city": data.get("city"),
            "country": data.get("country"),
            "start_date": data.get("start_date"),
            "end_date": data.get("end_date"),
            "activities": [],
            "budget": 0,
            "order": data.get("order", 0)
        }
        
        trips.update_one(
            {"_id": ObjectId(trip_id)},
            {"$push": {"destinations": destination}, "$set": {"updated_at": datetime.utcnow()}}
        )
        
        return jsonify({"message": "Destination added successfully"}), 201
    except:
        return jsonify({"error": "Failed to add destination"}), 400

@app.route("/api/cities/search", methods=["GET"])
def search_cities():
    query = request.args.get("q", "")
    region = request.args.get("region", "")
    
    # Mock city data - In production, use a real cities database
    mock_cities = [
        {"name": "Paris", "country": "France", "region": "Europe", "cost_index": 8, "popularity": 95},
        {"name": "Tokyo", "country": "Japan", "region": "Asia", "cost_index": 9, "popularity": 90},
        {"name": "New York", "country": "USA", "region": "North America", "cost_index": 9, "popularity": 92},
        {"name": "Bali", "country": "Indonesia", "region": "Asia", "cost_index": 4, "popularity": 88},
        {"name": "Barcelona", "country": "Spain", "region": "Europe", "cost_index": 6, "popularity": 89},
        {"name": "Dubai", "country": "UAE", "region": "Middle East", "cost_index": 8, "popularity": 85},
        {"name": "London", "country": "UK", "region": "Europe", "cost_index": 9, "popularity": 93},
        {"name": "Bangkok", "country": "Thailand", "region": "Asia", "cost_index": 3, "popularity": 87},
        {"name": "Rome", "country": "Italy", "region": "Europe", "cost_index": 7, "popularity": 91},
        {"name": "Istanbul", "country": "Turkey", "region": "Europe", "cost_index": 5, "popularity": 84}
    ]
    
    results = mock_cities
    
    if query:
        results = [c for c in results if query.lower() in c["name"].lower() or query.lower() in c["country"].lower()]
    
    if region:
        results = [c for c in results if c["region"] == region]
    
    return jsonify(results), 200

# ------------------ ACTIVITIES ------------------

@app.route("/api/activities/search", methods=["GET"])
def search_activities():
    city = request.args.get("city", "")
    activity_type = request.args.get("type", "")
    
    # Mock activity data
    mock_activities = [
        {
            "name": "Eiffel Tower Visit",
            "city": "Paris",
            "type": "sightseeing",
            "duration": 3,
            "cost": 25,
            "description": "Visit the iconic Eiffel Tower",
            "image": ""
        },
        {
            "name": "Louvre Museum",
            "city": "Paris",
            "type": "culture",
            "duration": 4,
            "cost": 17,
            "description": "Explore world's largest art museum",
            "image": ""
        },
        {
            "name": "Seine River Cruise",
            "city": "Paris",
            "type": "experience",
            "duration": 2,
            "cost": 35,
            "description": "Romantic cruise on Seine River",
            "image": ""
        }
    ]
    
    results = mock_activities
    
    if city:
        results = [a for a in results if a["city"].lower() == city.lower()]
    
    if activity_type:
        results = [a for a in results if a["type"] == activity_type]
    
    return jsonify(results), 200

@app.route("/api/activities/add", methods=["POST"])
def add_activity():
    try:
        data = request.json
        trip_id = data.get("trip_id")
        destination_index = data.get("destination_index")
        activity = {
            "name": data.get("name"),
            "time": data.get("time"),
            "duration": data.get("duration"),
            "cost": data.get("cost", 0),
            "type": data.get("type"),
            "description": data.get("description", ""),
            "day": data.get("day")
        }
        
        trips.update_one(
            {"_id": ObjectId(trip_id)},
            {
                "$push": {f"destinations.{destination_index}.activities": activity},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        return jsonify({"message": "Activity added successfully"}), 201
    except:
        return jsonify({"error": "Failed to add activity"}), 400

# ------------------ BUDGET & ANALYTICS ------------------

@app.route("/api/trips/<trip_id>/budget", methods=["GET"])
def get_trip_budget(trip_id):
    try:
        trip = trips.find_one({"_id": ObjectId(trip_id)})
        if not trip:
            return jsonify({"error": "Trip not found"}), 404
        
        # Calculate total budget from all activities and destinations
        budget = trip.get("budget", {
            "total": 0,
            "transport": 0,
            "stay": 0,
            "activities": 0,
            "food": 0
        })
        
        return jsonify(budget), 200
    except:
        return jsonify({"error": "Failed to fetch budget"}), 400

# ------------------ PUBLIC SHARING ------------------

@app.route("/api/trips/<trip_id>/share", methods=["POST"])
def share_trip(trip_id):
    try:
        trips.update_one(
            {"_id": ObjectId(trip_id)},
            {"$set": {"visibility": "public"}}
        )
        
        public_url = f"https://globetrotter.com/shared/{trip_id}"
        return jsonify({
            "message": "Trip is now public",
            "public_url": public_url
        }), 200
    except:
        return jsonify({"error": "Failed to share trip"}), 400

@app.route("/api/shared/<trip_id>", methods=["GET"])
def get_shared_trip(trip_id):
    try:
        trip = trips.find_one({"_id": ObjectId(trip_id), "visibility": "public"})
        if not trip:
            return jsonify({"error": "Trip not found or not public"}), 404
        
        return jsonify(serialize_doc(trip)), 200
    except:
        return jsonify({"error": "Invalid trip ID"}), 400

# ------------------ HEALTH CHECK ------------------

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "GlobeTrotter API running", "version": "1.0"}), 200

# ------------------
if __name__ == "__main__":
    app.run(debug=True)
