
import jwt
import bcrypt
import secrets
import string
import time
from database import get_db_connection

# Secret key for JWT
SECRET_KEY = "your_secret_key_for_jwt"  # In production, use an environment variable

# Token expiry (24 hours in seconds)
TOKEN_EXPIRY = 60 * 60 * 24

def generate_salt():
    """Generate a salt for password hashing"""
    return bcrypt.gensalt()

def hash_password(password, salt=None):
    """Hash a password with bcrypt"""
    if not salt:
        salt = generate_salt()
    password_bytes = password.encode('utf-8')
    salt_bytes = salt if isinstance(salt, bytes) else salt.encode('utf-8')
    hashed_password = bcrypt.hashpw(password_bytes, salt_bytes)
    return hashed_password.decode('utf-8')

def check_password(password, hashed_password):
    """Check if a password matches a hash"""
    password_bytes = password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

def verify_token(token):
    """Verify a JWT token"""
    try:
        print(f"Verifying token: {token[:20]}...")
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        print(f"Token decoded successfully: {payload}")
        return payload
    except jwt.ExpiredSignatureError:
        print("Token verification failed: Token expired")
        return {"error": "Token expired"}
    except jwt.InvalidTokenError as e:
        print(f"Token verification failed: Invalid token - {str(e)}")
        return {"error": f"Invalid token: {str(e)}"}
    except Exception as e:
        print(f"Unexpected error during token verification: {str(e)}")
        return {"error": f"Token verification error: {str(e)}"}

def generate_token(user_id, name, is_admin=False, is_artist=False, is_corporate=False):
    """Generate a JWT token for authentication"""
    payload = {
        "sub": user_id,
        "name": name,
        "is_admin": is_admin,
        "is_artist": is_artist,
        "is_corporate": is_corporate,
        "exp": int(time.time()) + TOKEN_EXPIRY
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

def register_user(name, email, password, phone=""):
    """Register a new user"""
    # Check if the email already exists
    connection = get_db_connection()
    if connection is None:
        return {"error": "Database connection failed"}
    
    cursor = connection.cursor()
    try:
        # Check if email exists in any user table
        cursor.execute(
            "SELECT id FROM users WHERE email = %s " +
            "UNION SELECT id FROM admins WHERE email = %s " +
            "UNION SELECT id FROM artists WHERE email = %s " + 
            "UNION SELECT id FROM corporate_users WHERE email = %s",
            (email, email, email, email)
        )
        if cursor.fetchone():
            return {"error": "Email already registered"}
        
        # Hash the password
        hashed_password = hash_password(password)
        
        # Insert the new user
        cursor.execute(
            "INSERT INTO users (name, email, password, phone, created_at) VALUES (%s, %s, %s, %s, NOW()) RETURNING id",
            (name, email, hashed_password, phone)
        )
        user_id = cursor.fetchone()[0]
        connection.commit()
        
        # Generate and return token
        token = generate_token(user_id, name)
        return {"token": token, "user_id": user_id, "name": name}
        
    except Exception as e:
        print(f"Error registering user: {e}")
        connection.rollback()
        return {"error": str(e)}
    finally:
        cursor.close()
        connection.close()

def register_artist(name, email, password, phone="", bio=""):
    """Register a new artist"""
    # Check if the email already exists
    connection = get_db_connection()
    if connection is None:
        return {"error": "Database connection failed"}
    
    cursor = connection.cursor()
    try:
        # Check if email exists in any user table
        cursor.execute(
            "SELECT id FROM users WHERE email = %s " +
            "UNION SELECT id FROM admins WHERE email = %s " +
            "UNION SELECT id FROM artists WHERE email = %s " +
            "UNION SELECT id FROM corporate_users WHERE email = %s",
            (email, email, email, email)
        )
        if cursor.fetchone():
            return {"error": "Email already registered"}
        
        # Hash the password
        hashed_password = hash_password(password)
        
        # Insert the new artist
        cursor.execute(
            "INSERT INTO artists (name, email, password, phone, bio, created_at) VALUES (%s, %s, %s, %s, %s, NOW()) RETURNING id",
            (name, email, hashed_password, phone, bio)
        )
        artist_id = cursor.fetchone()[0]
        connection.commit()
        
        # Generate and return token
        token = generate_token(artist_id, name, is_artist=True)
        return {"token": token, "artist_id": artist_id, "name": name}
        
    except Exception as e:
        print(f"Error registering artist: {e}")
        connection.rollback()
        return {"error": str(e)}
    finally:
        cursor.close()
        connection.close()

def register_corporate_user(name, email, password, phone="", company_name="", registration_number="", 
                            tax_id="", billing_address="", contact_person="", contact_position=""):
    """Register a new corporate user"""
    # Check if the email already exists
    connection = get_db_connection()
    if connection is None:
        return {"error": "Database connection failed"}
    
    cursor = connection.cursor()
    try:
        # Check if email exists in any user table
        cursor.execute(
            "SELECT id FROM users WHERE email = %s " +
            "UNION SELECT id FROM admins WHERE email = %s " +
            "UNION SELECT id FROM artists WHERE email = %s " +
            "UNION SELECT id FROM corporate_users WHERE email = %s",
            (email, email, email, email)
        )
        if cursor.fetchone():
            return {"error": "Email already registered"}
        
        # Hash the password
        hashed_password = hash_password(password)
        
        # Insert the new corporate user
        cursor.execute(
            """INSERT INTO corporate_users 
               (name, email, password, phone, company_name, registration_number, 
                tax_id, billing_address, contact_person, contact_position, created_at) 
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW()) RETURNING id""",
            (name, email, hashed_password, phone, company_name, registration_number,
             tax_id, billing_address, contact_person, contact_position)
        )
        corporate_id = cursor.fetchone()[0]
        connection.commit()
        
        # Generate and return token
        token = generate_token(corporate_id, name, is_corporate=True)
        return {"token": token, "corporate_user_id": corporate_id, "name": name}
        
    except Exception as e:
        print(f"Error registering corporate user: {e}")
        connection.rollback()
        return {"error": str(e)}
    finally:
        cursor.close()
        connection.close()

def login_user(email, password):
    """Login a user"""
    connection = get_db_connection()
    if connection is None:
        return {"error": "Database connection failed"}
    
    cursor = connection.cursor()
    try:
        # Get user with the given email
        cursor.execute(
            "SELECT id, name, password FROM users WHERE email = %s",
            (email,)
        )
        user = cursor.fetchone()
        
        if not user:
            return {"error": "Invalid email or password"}
        
        user_id, name, hashed_password = user
        
        # Check password
        if not check_password(password, hashed_password):
            return {"error": "Invalid email or password"}
        
        # Generate and return token
        token = generate_token(user_id, name)
        return {"token": token, "user_id": user_id, "name": name}
        
    except Exception as e:
        print(f"Error logging in user: {e}")
        return {"error": str(e)}
    finally:
        cursor.close()
        connection.close()

def login_artist(email, password):
    """Login an artist"""
    connection = get_db_connection()
    if connection is None:
        return {"error": "Database connection failed"}
    
    cursor = connection.cursor()
    try:
        # Get artist with the given email
        cursor.execute(
            "SELECT id, name, password FROM artists WHERE email = %s",
            (email,)
        )
        artist = cursor.fetchone()
        
        if not artist:
            return {"error": "Invalid email or password"}
        
        artist_id, name, hashed_password = artist
        
        # Check password
        if not check_password(password, hashed_password):
            return {"error": "Invalid email or password"}
        
        # Generate and return token
        token = generate_token(artist_id, name, is_artist=True)
        return {"token": token, "artist_id": artist_id, "name": name}
        
    except Exception as e:
        print(f"Error logging in artist: {e}")
        return {"error": str(e)}
    finally:
        cursor.close()
        connection.close()

def login_corporate_user(email, password):
    """Login a corporate user"""
    connection = get_db_connection()
    if connection is None:
        return {"error": "Database connection failed"}
    
    cursor = connection.cursor()
    try:
        # Get corporate user with the given email
        cursor.execute(
            "SELECT id, name, password FROM corporate_users WHERE email = %s",
            (email,)
        )
        corporate_user = cursor.fetchone()
        
        if not corporate_user:
            return {"error": "Invalid email or password"}
        
        corporate_id, name, hashed_password = corporate_user
        
        # Check password
        if not check_password(password, hashed_password):
            return {"error": "Invalid email or password"}
        
        # Generate and return token
        token = generate_token(corporate_id, name, is_corporate=True)
        return {"token": token, "corporate_user_id": corporate_id, "name": name}
        
    except Exception as e:
        print(f"Error logging in corporate user: {e}")
        return {"error": str(e)}
    finally:
        cursor.close()
        connection.close()

def login_admin(email, password):
    """Login an admin"""
    connection = get_db_connection()
    if connection is None:
        return {"error": "Database connection failed"}
    
    cursor = connection.cursor()
    try:
        # Get admin with the given email
        cursor.execute(
            "SELECT id, name, password FROM admins WHERE email = %s",
            (email,)
        )
        admin = cursor.fetchone()
        
        if not admin:
            return {"error": "Invalid email or password"}
        
        admin_id, name, hashed_password = admin
        
        # Check password
        if not check_password(password, hashed_password):
            return {"error": "Invalid email or password"}
        
        # Generate and return token
        token = generate_token(admin_id, name, is_admin=True)
        return {"token": token, "admin_id": admin_id, "name": name}
        
    except Exception as e:
        print(f"Error logging in admin: {e}")
        return {"error": str(e)}
    finally:
        cursor.close()
        connection.close()
