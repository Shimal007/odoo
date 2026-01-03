from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODEL = "llama-3.3-70b-versatile"  # Fast and excellent for structured output

@app.route("/itinerary", methods=["POST"])
def generate_itinerary():
    """
    POST /itinerary
    Body (JSON):
    {
        "city": "Napa Valley",
        "country": "USA",
        "startDate": "2024-06-15",   # YYYY-MM-DD
        "endDate": "2024-06-18"      # YYYY-MM-DD
    }
    """
    data = request.get_json()

    # Validate required fields
    required_fields = ["city", "country", "startDate", "endDate"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    city = data["city"]
    country = data["country"]
    start_date = data["startDate"]
    end_date = data["endDate"]

    # Optional: Basic date validation
    try:
        datetime.strptime(start_date, "%Y-%m-%d")
        datetime.strptime(end_date, "%Y-%m-%d")
    except ValueError:
        return jsonify({"error": "Dates must be in YYYY-MM-DD format"}), 400

    # Calculate number of days
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    num_days = (end - start).days + 1

    if num_days < 1 or num_days > 30:
        return jsonify({"error": "Invalid date range (must be 1-30 days)"}), 400

    # Build dynamic prompt
    prompt = f"""
You are an expert travel planner.

Create a detailed {num_days}-day itinerary for a trip to {city}, {country}, 
from {start_date} to {end_date} (inclusive).

Focus on popular attractions, local experiences, food, and relaxation.
Include a variety of activities each day.

Output ONLY valid JSON in this exact structure (no extra text or markdown):

{{
  "city": "{city}",
  "country": "{country}",
  "startDate": "{start_date}",
  "endDate": "{end_date}",
  "days": [
    {{
      "day": "Day 1: Month DD",
      "activities": [
        {{"id": 1, "time": "10:00 AM", "title": "Activity Title", "description": "Short description"}},
        ...
      ]
    }},
    ...
  ]
}}

- Use real month and day names (e.g., "Day 1: June 15")
- Each day should have 3–5 activities
- For 'title', use specific, real-world place names (e.g., 'Eiffel Tower' or 'L'Avenue Restaurant') that are easily searchable on Google Maps
- Time in 12-hour format with AM/PM
- Ensure JSON is perfectly valid and parseable
"""
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a precise JSON generator. Always output only valid JSON with no explanations."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model=MODEL,
            temperature=0.7,
            max_tokens=2048,
        )

        response_text = chat_completion.choices[0].message.content.strip()

        # Return both raw and parsed (if possible)
        try:
            import json
            parsed_json = json.loads(response_text)
            return jsonify({
                "success": True,
                "itinerary": parsed_json,
                "model": MODEL
            })
        except json.JSONDecodeError:
            # Fallback: return raw if parsing fails (rare with good prompt)
            return jsonify({
                "success": True,
                "itinerary_raw": response_text,
                "warning": "Response not perfect JSON - check formatting",
                "model": MODEL
            })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "Dynamic Travel Itinerary API"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)