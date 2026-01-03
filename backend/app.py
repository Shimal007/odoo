from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
from datetime import datetime
import json
import os
from dotenv import load_dotenv
from groq import Groq

from extensions import db
from config import Config
from models import User, Trip

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Initialize extensions
db.init_app(app)

# ------------------ USER AUTHENTICATION ------------------

@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    required_fields = ["first_name", "last_name", "email", "password"]
    
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"{field} is required"}), 400
    
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "User already exists"}), 409
    
    password_bytes = data["password"].encode("utf-8")
    hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    
    new_user = User(
        first_name=data["first_name"],
        last_name=data["last_name"],
        email=data["email"],
        phone=data.get("phone", ""),
        city=data.get("city", ""),
        country=data.get("country", ""),
        profile_photo=data.get("profile_photo", ""),
        password=hashed_password,
        preferences=json.dumps({
            "currency": "USD",
            "language": "en",
            "privacy": "public"
        }),
        saved_destinations=json.dumps([])
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({
        "message": "User registered successfully",
        "user_id": str(new_user.id)
    }), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    
    if "email" not in data or "password" not in data:
        return jsonify({"error": "Email and password required"}), 400
    
    user = User.query.filter_by(email=data["email"]).first()
    
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401
    
    password_bytes = data["password"].encode("utf-8")
    
    if bcrypt.checkpw(password_bytes, user.password):
        return jsonify({
            "message": "Login successful",
            "user": {
                "_id": str(user.id),
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "profile_photo": user.profile_photo or ""
            }
        }), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

# ------------------ USER PROFILE ------------------

@app.route("/api/user/<user_id>", methods=["GET"])
def get_user(user_id):
    try:
        user = User.query.get(int(user_id))
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify(user.to_dict()), 200
    except ValueError:
        return jsonify({"error": "Invalid user ID"}), 400

@app.route("/api/user/<user_id>", methods=["PUT"])
def update_user(user_id):
    try:
        data = request.json
        user = User.query.get(int(user_id))
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        allowed_fields = ["first_name", "last_name", "phone", "city", "country", "profile_photo"]
        for field in allowed_fields:
            if field in data:
                setattr(user, field, data[field])
        
        if "preferences" in data:
            user.preferences = json.dumps(data["preferences"])
            
        db.session.commit()
        return jsonify({"message": "Profile updated successfully"}), 200
    except ValueError:
        return jsonify({"error": "Invalid user ID"}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to update profile: {str(e)}"}), 400

# ------------------ TRIPS MANAGEMENT ------------------

@app.route("/api/trips", methods=["POST"])
def create_trip():
    data = request.json
    required_fields = ["user_id", "name", "start_date", "end_date"]
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400
    
    new_trip = Trip(
        user_id=int(data["user_id"]),
        name=data["name"],
        description=data.get("description", ""),
        start_date=data["start_date"],
        end_date=data["end_date"],
        cover_image=data.get("cover_image", ""),
        destinations=json.dumps([]),
        budget=json.dumps({
            "total": 0,
            "transport": 0,
            "stay": 0,
            "activities": 0,
            "food": 0
        }),
        status="planning",
        visibility="private"
    )
    
    db.session.add(new_trip)
    db.session.commit()
    
    return jsonify({
        "message": "Trip created successfully",
        "trip": new_trip.to_dict()
    }), 201

@app.route("/api/trips/user/<user_id>", methods=["GET"])
def get_user_trips(user_id):
    try:
        user_trips = Trip.query.filter_by(user_id=int(user_id)).order_by(Trip.created_at.desc()).all()
        return jsonify([trip.to_dict() for trip in user_trips]), 200
    except ValueError:
        return jsonify({"error": "Invalid user ID"}), 400

@app.route("/api/trips/<trip_id>", methods=["GET"])
def get_trip(trip_id):
    try:
        trip = Trip.query.get(int(trip_id))
        if not trip:
            return jsonify({"error": "Trip not found"}), 404
        
        return jsonify(trip.to_dict()), 200
    except ValueError:
        return jsonify({"error": "Invalid trip ID"}), 400

@app.route("/api/trips/<trip_id>", methods=["PUT"])
def update_trip(trip_id):
    try:
        data = request.json
        trip = Trip.query.get(int(trip_id))
        if not trip:
            return jsonify({"error": "Trip not found"}), 404
        
        allowed_fields = ["name", "description", "start_date", "end_date", "cover_image", "status", "visibility"]
        for field in allowed_fields:
            if field in data:
                setattr(trip, field, data[field])
        
        if "destinations" in data:
            trip.destinations = json.dumps(data["destinations"])
        if "budget" in data:
            trip.budget = json.dumps(data["budget"])
            
        db.session.commit()
        return jsonify({"message": "Trip updated successfully"}), 200
    except ValueError:
        return jsonify({"error": "Invalid trip ID"}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to update trip: {str(e)}"}), 400

@app.route("/api/trips/<trip_id>", methods=["DELETE"])
def delete_trip(trip_id):
    try:
        trip = Trip.query.get(int(trip_id))
        if not trip:
            return jsonify({"error": "Trip not found"}), 404
        
        db.session.delete(trip)
        db.session.commit()
        return jsonify({"message": "Trip deleted successfully"}), 200
    except ValueError:
        return jsonify({"error": "Invalid trip ID"}), 400

# ------------------ AI TRIP PLANNING ------------------
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
@app.route("/api/generate-ai-plan", methods=["POST"])
def generate_ai_plan():
    try:
        data = request.json
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
        
        # Date math for prompt
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
        num_days = (end - start).days + 1
        
        api_key = os.getenv("GROQ_API_KEY")
        client = Groq(api_key=api_key)
        MODEL = "llama-3.3-70b-versatile"
        
        prompt = f"""
Create a {num_days}-day trip plan for {city}, {country} from {start_date} to {end_date}.
Trip Name: {trip_name}
Description: {description}

Output ONLY valid JSON in this exact structure (no extra text or markdown):
{{
  "tripName": "{trip_name}",
  "city": "{city}",
  "country": "{country}",
  "startDate": "{start_date}",
  "endDate": "{end_date}",
  "overview": "...",
  "highlights": ["..."],
  "estimatedBudget": {{ "total": 0, "transport": 0, "accommodation": 0, "food": 0, "activities": 0 }},
  "days": [
    {{
      "dayNumber": 1,
      "date": "{start_date}",
      "title": "...",
      "activities": [
        {{ 
          "time": "09:00 AM", 
          "title": "...", 
          "description": "...", 
          "duration": "2 hours", 
          "cost": 25, 
          "type": "...", 
          "location": "...",
          "image_query": "specific descriptive query for a high-quality travel photo of this activity"
        }}
      ]
    }}
  ]
}}
"""
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a travel expert JSON generator."},
                {"role": "user", "content": prompt}
            ],
            model=MODEL,
            temperature=0.7,
            max_tokens=3000,
        )
        
        response_text = chat_completion.choices[0].message.content.strip()
        itinerary = json.loads(response_text)
        
        return jsonify({"success": True, "itinerary": itinerary}), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to generate AI plan", "details": str(e)}), 500
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
@app.route("/api/trip-insights", methods=["POST"])
def get_trip_insights():
    try:
        data = request.json
        city = data.get("city")
        country = data.get("country")
        start_date = data.get("startDate")
        
        api_key = os.getenv("GROQ_API_KEY")
        client = Groq(api_key=api_key)
        
        prompt = f"""
Provide travel insights for {city}, {country} starting {start_date}.
Output ONLY valid JSON:
{{
  "packingList": ["item 1", "item 2", ...],
  "weatherForecast": "...",
  "localPhrases": [
    {{"phrase": "...", "translation": "...", "pronunciation": "..."}}
  ],
  "proTips": ["tip 1", "tip 2", ...]
}}
"""
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a travel consultant."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=1000,
        )
        
        response_text = chat_completion.choices[0].message.content.strip()
        insights = json.loads(response_text)
        return jsonify(insights), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/trips/save-ai-plan", methods=["POST"])
def save_ai_plan():
    try:
        data = request.json
        user_id = data.get("user_id")
        itinerary = data.get("itinerary")
        
        dest_activities = []
        for day in itinerary.get("days", []):
            for activity in day.get("activities", []):
                dest_activities.append({
                    "day": day["dayNumber"],
                    "name": activity["title"],
                    "time": activity["time"],
                    "duration": activity.get("duration", "1 hour"),
                    "cost": activity.get("cost", 0),
                    "type": activity.get("type", "other"),
                    "description": activity["description"],
                    "location": activity.get("location", "")
                })

        new_trip = Trip(
            user_id=int(user_id),
            name=itinerary.get("tripName", "AI Generated Trip"),
            description=itinerary.get("overview", ""),
            start_date=itinerary.get("startDate"),
            end_date=itinerary.get("endDate"),
            destinations=json.dumps([{
                "city": itinerary.get("city"),
                "country": itinerary.get("country"),
                "start_date": itinerary.get("startDate"),
                "end_date": itinerary.get("endDate"),
                "activities": dest_activities,
                "budget": 0,
                "order": 0
            }]),
            budget=json.dumps(itinerary.get("estimatedBudget", {})),
            status="planning",
            visibility="private",
            ai_generated=True
        )
        
        db.session.add(new_trip)
        db.session.commit()
        
        return jsonify({
            "message": "AI trip plan saved successfully",
            "trip": new_trip.to_dict()
        }), 201
    except Exception as e:
        return jsonify({"error": "Failed to save AI plan", "details": str(e)}), 500

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "GlobeTrotter API running (SQLite)", "version": "1.2"}), 200

if __name__ == "__main__":
    app.run(debug=True)
