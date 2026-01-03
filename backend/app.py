from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import bcrypt
from datetime import datetime, timedelta
import json
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

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

# ------------------ AI TRIP PLANNING ------------------

@app.route("/api/generate-ai-plan", methods=["POST"])
def generate_ai_plan():
    """
    Generate an AI-powered trip plan using Groq API
    Body: {
        "city": "Chennai",
        "country": "India",
        "startDate": "2024-06-15",
        "endDate": "2024-06-18",
        "tripName": "Optional trip name",
        "description": "Optional description"
    }
    """
    try:
        print("=== AI Plan Generation Started ===")
        data = request.json
        print(f"Received data: {data}")
        
        required_fields = ["city", "country", "startDate", "endDate"]
        
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        city = data["city"]
        country = data["country"]
        start_date = data["startDate"]
        end_date = data["endDate"]
        trip_name = data.get("tripName", f"Trip to {city}")
        description = data.get("description", "")
        
        print(f"Trip: {trip_name}, {city}, {country}, {start_date} to {end_date}")
        
        # Validate dates
        try:
            start = datetime.strptime(start_date, "%Y-%m-%d")
            end = datetime.strptime(end_date, "%Y-%m-%d")
            num_days = (end - start).days + 1
            
            if num_days < 1 or num_days > 30:
                return jsonify({"error": "Invalid date range (must be 1-30 days)"}), 400
        except ValueError as e:
            print(f"Date validation error: {e}")
            return jsonify({"error": "Dates must be in YYYY-MM-DD format"}), 400
        
        print(f"Number of days: {num_days}")
        
        # Initialize Groq client
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            print("ERROR: GROQ_API_KEY not found in environment")
            return jsonify({"error": "GROQ_API_KEY not configured"}), 500
            
        print(f"API Key found: {api_key[:10]}...")
        client = Groq(api_key=api_key)
        MODEL = "llama-3.3-70b-versatile"
        
        # Build AI prompt
        prompt = f"""
You are an expert travel planner creating a detailed itinerary.

Create a {num_days}-day trip plan for {city}, {country} from {start_date} to {end_date}.

Trip Details:
- Name: {trip_name}
- Description: {description if description else "An amazing adventure"}

Include:
- Popular attractions and hidden gems
- Local cuisine recommendations
- Cultural experiences
- Best times to visit each place
- Estimated costs in USD
- Travel tips

Output ONLY valid JSON in this exact structure (no extra text or markdown):

{{
  "tripName": "{trip_name}",
  "city": "{city}",
  "country": "{country}",
  "startDate": "{start_date}",
  "endDate": "{end_date}",
  "overview": "Brief trip overview (2-3 sentences)",
  "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
  "estimatedBudget": {{
    "total": 0,
    "transport": 0,
    "accommodation": 0,
    "food": 0,
    "activities": 0
  }},
  "days": [
    {{
      "dayNumber": 1,
      "date": "{start_date}",
      "title": "Day title (e.g., Arrival & Exploration)",
      "activities": [
        {{
          "time": "09:00 AM",  
          "title": "Activity name (real place)",
          "description": "What to do",
          "duration": "2 hours",
          "cost": 25,
          "type": "sightseeing|food|culture|adventure|shopping|relaxation",
          "location": "Exact address or area"
        }}
      ]
    }}
  ]
}}

Guidelines:
- Use real place names searchable on Google Maps
- Include 4-6 activities per day
- Mix different activity types
- Include breakfast, lunch, dinner recommendations
- Estimate realistic costs
- Format times as 12-hour with AM/PM
"""

        print("Calling Groq API...")
        # Call Groq API
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a precise JSON generator for travel itineraries. Always output only valid JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model=MODEL,
            temperature=0.7,
            max_tokens=3000,
        )
        
        response_text = chat_completion.choices[0].message.content.strip()
        print(f"Received response (first 200 chars): {response_text[:200]}...")
        
        # Parse JSON response
        itinerary = json.loads(response_text)
        print("JSON parsed successfully!")
        
        return jsonify({
            "success": True,
            "itinerary": itinerary,
            "model": MODEL
        }), 200
        
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        print(f"Response text: {response_text[:500] if 'response_text' in locals() else 'N/A'}")
        return jsonify({
            "error": "Failed to parse AI response",
            "details": str(e),
            "raw_response": response_text[:500] if 'response_text' in locals() else None
        }), 500
        
    except Exception as e:
        print(f"ERROR in generate_ai_plan: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": "Failed to generate AI plan",
            "details": str(e)
        }), 500

@app.route("/api/trips/save-ai-plan", methods=["POST"])
def save_ai_plan():
    """
    Save an AI-generated plan as a trip
    Body: {
        "user_id": "123",
        "itinerary": { ... AI generated itinerary ... }
    }
    """
    try:
        data = request.json
        user_id = data.get("user_id")
        itinerary = data.get("itinerary")
        
        if not user_id or not itinerary:
            return jsonify({"error": "Missing user_id or itinerary"}), 400
        
        # Convert AI itinerary to trip format
        trip_data = {
            "user_id": user_id,
            "name": itinerary.get("tripName", "AI Generated Trip"),
            "description": itinerary.get("overview", ""),
            "start_date": itinerary.get("startDate"),
            "end_date": itinerary.get("endDate"),
            "cover_image": "",
            "destinations": [
                {
                    "city": itinerary.get("city"),
                    "country": itinerary.get("country"),
                    "start_date": itinerary.get("startDate"),
                    "end_date": itinerary.get("endDate"),
                    "activities": [
                        {
                            "day": day["dayNumber"],
                            "name": activity["title"],
                            "time": activity["time"],
                            "duration": activity.get("duration", "1 hour"),
                            "cost": activity.get("cost", 0),
                            "type": activity.get("type", "other"),
                            "description": activity["description"],
                            "location": activity.get("location", "")
                        }
                        for day in itinerary.get("days", [])
                        for activity in day.get("activities", [])
                    ],
                    "budget": 0,
                    "order": 0
                }
            ],
            "budget": itinerary.get("estimatedBudget", {
                "total": 0,
                "transport": 0,
                "stay": 0,
                "activities": 0,
                "food": 0
            }),
            "status": "planning",
            "visibility": "private",
            "ai_generated": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = trips.insert_one(trip_data)
        trip_data["_id"] = str(result.inserted_id)
        
        return jsonify({
            "message": "AI trip plan saved successfully",
            "trip": serialize_doc(trip_data)
        }), 201
        
    except Exception as e:
        return jsonify({
            "error": "Failed to save AI plan",
            "details": str(e)
        }), 500

# ------------------ HEALTH CHECK ------------------

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "GlobeTrotter API running", "version": "1.0"}), 200

# ------------------
if __name__ == "__main__":
    app.run(debug=True)
