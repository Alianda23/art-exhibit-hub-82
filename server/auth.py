
# Add this function to your auth.py file

def register_corporate_user(name, email, password, phone, company_name, business_type, tax_id=""):
    """Register a new corporate user"""
    connection = get_db_connection()
    if connection is None:
        return {"error": "Database connection failed"}
    
    cursor = connection.cursor()
    hashed_password = hash_password(password)
    
    try:
        # Check if email already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return {"error": "Email already registered"}
        
        # Insert the new corporate user
        query = """
        INSERT INTO users (name, email, password, phone, is_corporate, company_name, business_type, tax_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (name, email, hashed_password, phone, True, company_name, business_type, tax_id))
        connection.commit()
        
        # Get the new user ID
        user_id = cursor.lastrowid
        
        # Generate token for the new corporate user
        token = generate_token(user_id, name, False, False, True)
        
        return {
            "token": token,
            "user_id": user_id,
            "name": name,
            "is_corporate": True,
            "company_name": company_name
        }
    except Exception as e:
        print(f"Error registering corporate user: {e}")
        return {"error": str(e)}
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

# Update the generate_token function to include corporate users
def generate_token(user_id, name, is_admin, is_artist=False, is_corporate=False):
    """Generate a JWT token for authentication"""
    payload = {
        "sub": str(user_id),  # Ensure user_id is converted to string
        "name": name,
        "is_admin": is_admin,
        "is_artist": is_artist,
        "is_corporate": is_corporate,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }
    
    print(f"Generating token with payload: {payload}")
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token
