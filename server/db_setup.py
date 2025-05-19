
import os
import psycopg2
import sqlite3
from database import get_db_connection

def initialize_database():
    """Initialize the database with the schema"""
    connection = get_db_connection()
    
    if connection is None:
        print("Failed to connect to the database")
        return False
    
    cursor = connection.cursor()
    
    try:
        # Read schema.sql file
        with open(os.path.join(os.path.dirname(__file__), 'schema.sql'), 'r') as f:
            schema_sql = f.read()
        
        # Execute schema SQL
        cursor.execute(schema_sql)
        connection.commit()
        print("Database schema initialized successfully")
        
        # Check if admin table is empty
        cursor.execute("SELECT COUNT(*) FROM admins")
        admin_count = cursor.fetchone()[0]
        
        if admin_count == 0:
            # Add a default admin for testing
            from auth import hash_password
            default_password = hash_password("admin123")
            
            cursor.execute(
                "INSERT INTO admins (name, email, password) VALUES (%s, %s, %s)",
                ("Admin", "admin@example.com", default_password)
            )
            connection.commit()
            print("Default admin user created")
        
        return True
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        connection.rollback()
        return False
        
    finally:
        cursor.close()
        connection.close()

if __name__ == "__main__":
    initialize_database()
