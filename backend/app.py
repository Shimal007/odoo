from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt

app = Flask(__name__)
CORS(app)

# ------------------ MongoDB ------------------
client = MongoClient("mongodb://localhost:27017/")
db = client["auth_system"]
users = db["users"]

# ------------------ REGISTER ------------------
@app.route("/api/register", methods=["POST"])
def register():
    data = request.json

    required_fields = [
        "first_name", "last_name", "email",
        "phone", "city", "country", "password"
    ]

    # validate fields
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"{field} is required"}), 400

    # check existing user
    if users.find_one({"email": data["email"]}):
        return jsonify({"error": "User already exists"}), 409

    # bcrypt hashing
    password_bytes = data["password"].encode("utf-8")
    hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())

    users.insert_one({
        "first_name": data["first_name"],
        "last_name": data["last_name"],
        "email": data["email"],
        "phone": data["phone"],
        "city": data["city"],
        "country": data["country"],
        "additional_info": data.get("additional_info", ""),
        "profile_photo": data.get("profile_photo", ""), # Base64 string
        "password": hashed_password
    })

    return jsonify({"message": "User registered successfully"}), 201


# ------------------ LOGIN ------------------
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
                "email": user["email"],
                "first_name": user["first_name"],
                "last_name": user["last_name"],
                "profile_photo": user.get("profile_photo", "")
            }
        }), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401


# ------------------ HEALTH CHECK ------------------
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "Server running"}), 200


# ------------------
if __name__ == "__main__":
    app.run(debug=True)
