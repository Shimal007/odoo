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
        MODEL = "openai/gpt-oss-120b"
        
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

Output ONLY valid JSON in this exact structure:

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

@app.route("/api/inspiration", methods=["GET"])
def get_inspiration():
    """
    Generate travel inspiration posts and tips using AI
    """
    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return jsonify({"error": "GROQ_API_KEY not configured"}), 500
            
        client = Groq(api_key=api_key)
        MODEL = "openai/gpt-oss-120b"
        
        prompt = """
        You are a travel editor for a global lifestyle magazine.
        Generate 9 diverse travel inspiration posts and 4 quick travel tips.
        
        For each post, include:
        - title (compelling, e.g., 'Secrets of the Amalfi Coast')
        - category (Beach, Adventure, Culture, Food, Luxury, or Budget)
        - excerpt (1-2 sentences of storytelling)
        - author (fictional travel journalist name)
        - readTime (e.g., '6 min read')
        - views (a realistic number like '12.4K')
        - query (a specific search term for an image, e.g., 'italy coastal village')
        
        For each tip, include:
        - title
        - description
        - icon (a relevant emoji)
        
        Output ONLY valid JSON in this structure:
        {
            "posts": [
                { "id": 1, "title": "...", "category": "...", "excerpt": "...", "author": "...", "readTime": "...", "views": "...", "query": "..." },
                ...
            ],
            "tips": [
                { "title": "...", "description": "...", "icon": "..." },
                ...
            ]
        }
        """

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a precise JSON generator. Always respond with only valid, parseable JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model=MODEL,
            temperature=0.8,
            max_tokens=2500,
        )

        response_text = chat_completion.choices[0].message.content.strip()
        data = json.loads(response_text)
        
        # Category-based high-quality Unsplash images (Fixed and fast)
        category_images = {
            "Beach": [
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
                "https://images.unsplash.com/photo-1519046904884-53103b34b206",
                "https://images.unsplash.com/photo-1473116763249-2faaef81ccda"
            ],
            "Adventure": [
                "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
                "https://images.unsplash.com/photo-1533240332313-0db49b459ad6",
                "https://images.unsplash.com/photo-1501555088652-021faa106b9b"
            ],
            "Culture": [
                "https://images.unsplash.com/photo-1524492707540-c50d87458ec2",
                "https://images.unsplash.com/photo-1528127269322-539801943592",
                "https://images.unsplash.com/photo-1533929736458-ca588d08c8be"
            ],
            "Food": [
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
                "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
                "https://images.unsplash.com/photo-1482049016688-2d3e1b311543"
            ],
            "Luxury": [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945",
                "https://images.unsplash.com/photo-1582719508461-905c673771fd",
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d"
            ],
            "Budget": [
                "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9",
                "https://images.unsplash.com/photo-1506157786151-b8491531f063",
                "https://images.unsplash.com/photo-1493246507139-91e8fad9978e"
            ]
        }
        
        # Add dynamic image URLs
        import random
        # Normalize keys to lowercase for robust matching
        normalized_images = {k.lower(): v for k, v in category_images.items()}
        # Add common variations
        normalized_images["cultural"] = normalized_images["culture"]
        
        for i, post in enumerate(data['posts']):
            cat = post.get('category', 'Culture').strip().lower()
            
            # Map common variations to strict categories
            if "beach" in cat: cat = "beach"
            elif "culture" in cat or "cultural" in cat: cat = "culture"
            elif "food" in cat or "dining" in cat: cat = "food"
            elif "luxury" in cat: cat = "luxury"
            elif "budget" in cat: cat = "budget"
            elif "adventure" in cat: cat = "adventure"
            
            img_list = normalized_images.get(cat, normalized_images["culture"])
            base_url = random.choice(img_list)
            post['image'] = f"{base_url}?auto=format&fit=crop&w=800&q=80"
            
        return jsonify(data), 200
    except Exception as e:
        print(f"Error in get_inspiration: {e}")
        return jsonify({"error": str(e)}), 500
@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        user_message = data.get("message")
        history = data.get("history", [])  # List of previous {"role": "user/system/assistant", "content": "..."}
        
        if not user_message:
            return jsonify({"error": "Message required"}), 400

        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return jsonify({"error": "API key missing"}), 500

        client = Groq(api_key=api_key)
        MODEL = "llama-3.3-70b-versatile"  # Or your preferred model

        # System prompt for travel assistant
        system_prompt = {
            "role": "system",
            "content": """You are a luxury travel concierge for GlobeTrotter. 
            Your goal is to provide high-end, bespoke travel advice.
            
            IMPORTANT FORMATTING RULES:
            - NEVER use JSON format in your responses
            - ALWAYS use beautiful Markdown formatting (headings, bold, lists, etc.)
            - Use descriptive, elegant language
            - Structure travel plans with clear headings and numbered lists
            - Include emoji icons for visual appeal (✈️ 🏨 🍽️ 🏛️ 🌅)
            - Keep your tone sophisticated but helpful
            - Answer in the currency the user prefers (default to USD/INR)
            
            Example format for itineraries:
            ## 🌟 Your Weekend in [City]
            
            ### Day 1: [Theme]
            1. **Morning:** [Activity] - [Description]
            2. **Afternoon:** [Activity] - [Description]
            
            Make every response visually engaging and easy to read!"""
        }

        # Build messages: system + history + new user message
        messages = [system_prompt] + history + [{"role": "user", "content": user_message}]

        completion = client.chat.completions.create(
            messages=messages,
            model=MODEL,
            temperature=0.7,
            max_tokens=2000
        )

        response = completion.choices[0].message.content.strip()

        # Always return markdown formatted response
        return jsonify({"response": response}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------ HEALTH CHECK ------------------

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "GlobeTrotter API running", "version": "1.0"}), 200

# ------------------
if __name__ == "__main__":
    app.run(debug=True)
