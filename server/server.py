
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
from json import dumps as json_dumps
from urllib.parse import parse_qs, urlparse
import os
import time
from artwork import get_artworks, get_artwork_by_id, add_artwork, update_artwork, delete_artwork
from exhibition import get_exhibitions, get_exhibition_by_id, add_exhibition, update_exhibition, delete_exhibition
from auth import login_user, register_user, register_artist, register_corporate_user
from mpesa import initiate_mpesa_payment, check_mpesa_payment
from contact import add_message, get_messages
from middleware import require_auth, load_user_id
import mimetypes
import cgi
from db_operations import process_order, process_booking

# Define host and port
HOST = "localhost"
PORT = 8000

# Define the HTTP request handler
class ServerHandler(BaseHTTPRequestHandler):
    def _set_response(self, status_code=200, content_type="application/json"):
        self.send_response(status_code)
        self.send_header("Content-type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_response()

    def do_GET(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        # Serve static files
        if path.startswith('/static/'):
            try:
                file_path = os.path.join(os.getcwd(), path.lstrip('/'))
                with open(file_path, 'rb') as file:
                    self._set_response(200, mimetypes.guess_type(file_path)[0] or 'application/octet-stream')
                    self.wfile.write(file.read())
                return
            except FileNotFoundError:
                self._set_response(404)
                self.wfile.write(json_dumps({"error": "File not found"}).encode())
                return
        
        # Get artworks
        if path == "/artworks":
            artworks = get_artworks()
            self._set_response()
            self.wfile.write(json_dumps({"artworks": artworks}).encode())
            return
            
        # Get artwork by ID
        elif path.startswith("/artworks/"):
            artwork_id = path.split("/")[-1]
            artwork = get_artwork_by_id(artwork_id)
            if artwork:
                self._set_response()
                self.wfile.write(json_dumps({"artwork": artwork}).encode())
            else:
                self._set_response(404)
                self.wfile.write(json_dumps({"error": "Artwork not found"}).encode())
            return
            
        # Get exhibitions
        elif path == "/exhibitions":
            exhibitions = get_exhibitions()
            self._set_response()
            self.wfile.write(json_dumps({"exhibitions": exhibitions}).encode())
            return
            
        # Get exhibition by ID
        elif path.startswith("/exhibitions/"):
            exhibition_id = path.split("/")[-1]
            exhibition = get_exhibition_by_id(exhibition_id)
            if exhibition:
                self._set_response()
                self.wfile.write(json_dumps({"exhibition": exhibition}).encode())
            else:
                self._set_response(404)
                self.wfile.write(json_dumps({"error": "Exhibition not found"}).encode())
            return
            
        # Get contact messages with authentication
        elif path == "/messages":
            auth_header = self.headers.get('Authorization')
            if not auth_header:
                self._set_response(401)
                self.wfile.write(json_dumps({"error": "Authorization header required"}).encode())
                return
                
            token = auth_header.split(" ")[1] if len(auth_header.split(" ")) > 1 else ""
            auth_result = require_auth(token, True)  # Only admin can access messages
            
            if "error" in auth_result:
                self._set_response(401)
                self.wfile.write(json_dumps(auth_result).encode())
                return
                
            messages = get_messages()
            self._set_response()
            self.wfile.write(json_dumps({"messages": messages}).encode())
            return
            
        # Default response for unknown paths
        else:
            self._set_response(404)
            self.wfile.write(json_dumps({"error": "Not found"}).encode())
            return

    def do_POST(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        # Get content length
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = None
        
        # Parse form data for file uploads
        if content_length > 0:
            if self.headers.get('Content-Type', '').startswith('multipart/form-data'):
                form = cgi.FieldStorage(
                    fp=self.rfile,
                    headers=self.headers,
                    environ={'REQUEST_METHOD': 'POST'}
                )
                post_data = {}
                for field in form.keys():
                    if form[field].filename:  # This is a file upload
                        file_data = form[field].file.read()
                        file_name = form[field].filename
                        timestamp = time.strftime("%Y%m%d%H%M%S")
                        
                        # Define upload path
                        upload_dir = "server/static/uploads"
                        os.makedirs(upload_dir, exist_ok=True)
                        
                        # Determine file type (artwork or exhibition)
                        prefix = "artwork_" if "artwork" in path else "exhibition_"
                        file_path = f"{upload_dir}/{prefix}{timestamp}{os.path.splitext(file_name)[1]}"
                        
                        # Save the file
                        with open(file_path, 'wb') as f:
                            f.write(file_data)
                        
                        post_data[field] = f"/{file_path.replace('server/', '')}"
                    else:
                        post_data[field] = form[field].value
            else:
                # Parse JSON data
                post_data = json.loads(self.rfile.read(content_length))
        
        # Login route
        if path == '/login':
            if not post_data:
                self._set_response(400)
                self.wfile.write(json_dumps({"error": "Missing login credentials"}).encode())
                return
                
            email = post_data.get('email')
            password = post_data.get('password')
            
            if not email or not password:
                self._set_response(400)
                self.wfile.write(json_dumps({"error": "Email and password are required"}).encode())
                return
                
            response = login_user(email, password)
            
            if "error" in response:
                self._set_response(401)
            else:
                self._set_response(200)
                
            self.wfile.write(json_dumps(response).encode())
            return
            
        # Register route
        elif path == '/register':
            if not post_data:
                self._set_response(400)
                self.wfile.write(json_dumps({"error": "Missing registration data"}).encode())
                return
                
            name = post_data.get('name')
            email = post_data.get('email')
            password = post_data.get('password')
            phone = post_data.get('phone', '')
            
            if not name or not email or not password:
                self._set_response(400)
                self.wfile.write(json_dumps({"error": "Name, email, and password are required"}).encode())
                return
                
            response = register_user(name, email, password, phone)
            
            if "error" in response:
                self._set_response(400)
            else:
                self._set_response(201)
                
            self.wfile.write(json_dumps(response).encode())
            return
            
        # Register artist
        elif path == '/register-artist':
            if not post_data:
                self._set_response(400)
                self.wfile.write(json_dumps({"error": "Missing registration data"}).encode())
                return
                
            name = post_data.get('name')
            email = post_data.get('email')
            password = post_data.get('password')
            phone = post_data.get('phone', '')
            bio = post_data.get('bio', '')
            
            if not name or not email or not password:
                self._set_response(400)
                self.wfile.write(json_dumps({"error": "Name, email, and password are required"}).encode())
                return
                
            response = register_artist(name, email, password, phone, bio)
            
            if "error" in response:
                self._set_response(400)
            else:
                self._set_response(201)
                
            self.wfile.write(json_dumps(response).encode())
            return
        
        # Register corporate user
        elif path == '/register-corporate':
            if not post_data:
                self._set_response(400)
                self.wfile.write(json_dumps({"error": "Missing registration data"}).encode())
                return
            
            print(f"Corporate Registration data: {post_data}")
            
            # Check required fields
            required_fields = ['name', 'email', 'password', 'company_name', 'business_type']
            missing_fields = [field for field in required_fields if field not in post_data]
            
            if missing_fields:
                self._set_response(400)
                self.wfile.write(json_dumps({"error": f"Missing required fields: {', '.join(missing_fields)}"}).encode())
                return
            
            # Register the corporate user
            response = register_corporate_user(
                post_data['name'], 
                post_data['email'], 
                post_data['password'],
                post_data.get('phone', ''),
                post_data['company_name'],
                post_data['business_type'],
                post_data.get('tax_id', '')
            )
            
            if "error" in response:
                self._set_response(400)
            else:
                self._set_response(201)
            
            self.wfile.write(json_dumps(response).encode())
            return
            
        # Add artwork
        elif path == '/artworks':
            auth_header = self.headers.get('Authorization')
            if not auth_header:
                self._set_response(401)
                self.wfile.write(json_dumps({"error": "Authorization header required"}).encode())
                return
                
            token = auth_header.split(" ")[1] if len(auth_header.split(" ")) > 1 else ""
            auth_result = require_auth(token)
            
            if "error" in auth_result:
                self._set_response(401)
                self.wfile.write(json_dumps(auth_result).encode())
                return
                
            user_id = load_user_id(token)
            
            if not post_data:
                self._set_response(400)
                self.wfile.write(json_dumps({"error": "Missing artwork data"}).encode())
                return
                
            # Check required fields
            required_fields = ['title', 'description', 'price']
            for field in required_fields:
                if field not in post_data:
                    self._set_response(400)
                    self.wfile.write(json_dumps({"error": f"Missing required field: {field}"}).encode())
                    return
            
            # Add the artwork
            artwork_data = {
                'title': post_data['title'],
                'description': post_data['description'],
                'price': post_data['price'],
                'dimensions': post_data.get('dimensions', ''),
                'medium': post_data.get('medium', ''),
                'year': post_data.get('year', 2023),
                'status': 'available',
                'image_url': post_data.get('image', ''),
                'artist_id': user_id
            }
            
            result = add_artwork(artwork_data)
            
            if "error" in result:
                self._set_response(400)
                self.wfile.write(json_dumps(result).encode())
            else:
                self._set_response(201)
                self.wfile.write(json_dumps({"message": "Artwork added successfully", "artwork_id": result["artwork_id"]}).encode())
            return
            
        # Add exhibition
        elif path == '/exhibitions':
            auth_header = self.headers.get('Authorization')
            if not auth_header:
                self._set_response(401)
                self.wfile.write(json_dumps({"error": "Authorization header required"}).encode())
                return
                
            token = auth_header.split(" ")[1] if len(auth_header.split(" ")) > 1 else ""
            auth_result = require_auth(token, True)  # Only admin can add exhibitions
            
            if "error" in auth_result:
                self._set_response(401)
                self.wfile.write(json_dumps(auth_result).encode())
                return
                
            if not post_data:
                self._set_response(400)
                self.wfile.write(json_dumps({"error": "Missing exhibition data"}).encode())
                return
                
            # Check required fields
            required_fields = ['title', 'description', 'location', 'startDate', 'endDate', 'ticketPrice', 'totalSlots']
            for field in required_fields:
                if field not in post_data:
                    self._set_response(400)
                    self.wfile.write(json_dumps({"error": f"Missing required field: {field}"}).encode())
                    return
            
            # Add the exhibition
            exhibition_data = {
                'title': post_data['title'],
                'description': post_data['description'],
                'location': post_data['location'],
                'start_date': post_data['startDate'],
                'end_date': post_data['endDate'],
                'ticket_price': post_data['ticketPrice'],
                'total_slots': post_data['totalSlots'],
                'available_slots': post_data['totalSlots'],
                'status': post_data.get('status', 'upcoming'),
                'image_url': post_data.get('image', '')
            }
            
            result = add_exhibition(exhibition_data)
            
            if "error" in result:
                self._set_response(400)
                self.wfile.write(json_dumps(result).encode())
            else:
                self._set_response(201)
                self.wfile.write(json_dumps({"message": "Exhibition added successfully", "exhibition_id": result["exhibition_id"]}).encode())
            return
            
        # Add contact message
        elif path == '/contact':
            if not post_data:
                self._set_response(400)
                self.wfile.write(json_dumps({"error": "Missing contact data"}).encode())
                return
                
            # Check required fields
            required_fields = ['name', 'email', 'message']
            for field in required_fields:
                if field not in post_data:
                    self._set_response(400)
                    self.wfile.write(json_dumps({"error": f"Missing required field: {field}"}).encode())
                    return
            
            # Add the message
            message_data = {
                'name': post_data['name'],
                'email': post_data['email'],
                'phone': post_data.get('phone', ''),
                'message': post_data['message'],
                'status': 'new'
            }
            
            result = add_message(message_data)
            
            if "error" in result:
                self._set_response(400)
                self.wfile.write(json_dumps(result).encode())
            else:
                self._set_response(201)
                self.wfile.write(json_dumps({"message": "Message sent successfully"}).encode())
            return
            
        # Process order
        elif path == '/process-order':
            if not post_data:
                self._set_response(400)
                self.wfile.write(json_dumps({"error": "Missing order data"}).encode())
                return
                
            # Check required fields
            required_fields = ['userId', 'artworkId', 'name', 'email', 'phone', 'deliveryAddress', 'paymentMethod', 'totalAmount']
            for field in required_fields:
                if field not in post_data:
                    self._set_response(400)
                    self.wfile.write(json_dumps({"error": f"Missing required field: {field}"}).encode())
                    return
            
            # Process the order
            result = process_order(post_data)
            
            if "error" in result:
                self._set_response(400)
                self.wfile.write(json_dumps(result).encode())
            else:
                self._set_response(201)
                self.wfile.write(json_dumps(result).encode())
            return
            
        # Process booking
        elif path == '/process-booking':
            if not post_data:
                self._set_response(400)
                self.wfile.write(json_dumps({"error": "Missing booking data"}).encode())
                return
                
            # Check required fields
            required_fields = ['userId', 'exhibitionId', 'name', 'email', 'phone', 'slots', 'paymentMethod', 'totalAmount']
            for field in required_fields:
                if field not in post_data:
                    self._set_response(400)
                    self.wfile.write(json_dumps({"error": f"Missing required field: {field}"}).encode())
                    return
            
            # Process the booking
            result = process_booking(post_data)
            
            if "error" in result:
                self._set_response(400)
                self.wfile.write(json_dumps(result).encode())
            else:
                self._set_response(201)
                self.wfile.write(json_dumps(result).encode())
            return
            
        # Initiate M-Pesa payment
        elif path == '/mpesa/initiate':
            if not post_data:
                self._set_response(400)
                self.wfile.write(json_dumps({"error": "Missing payment data"}).encode())
                return
                
            # Check required fields
            required_fields = ['phone', 'amount', 'description']
            for field in required_fields:
                if field not in post_data:
                    self._set_response(400)
                    self.wfile.write(json_dumps({"error": f"Missing required field: {field}"}).encode())
                    return
            
            # Initiate the payment
            result = initiate_mpesa_payment(post_data['phone'], post_data['amount'], post_data['description'])
            
            if "error" in result:
                self._set_response(400)
                self.wfile.write(json_dumps(result).encode())
            else:
                self._set_response(200)
                self.wfile.write(json_dumps(result).encode())
            return
            
        # Check M-Pesa payment status
        elif path == '/mpesa/check':
            if not post_data or 'checkout_request_id' not in post_data:
                self._set_response(400)
                self.wfile.write(json_dumps({"error": "Missing checkout_request_id"}).encode())
                return
                
            # Check the payment status
            result = check_mpesa_payment(post_data['checkout_request_id'])
            
            if "error" in result:
                self._set_response(400)
                self.wfile.write(json_dumps(result).encode())
            else:
                self._set_response(200)
                self.wfile.write(json_dumps(result).encode())
            return
            
        # Default response for unknown paths
        else:
            self._set_response(404)
            self.wfile.write(json_dumps({"error": "Not found"}).encode())
            return

    def do_PUT(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        # Check authentication for all PUT requests
        auth_header = self.headers.get('Authorization')
        if not auth_header:
            self._set_response(401)
            self.wfile.write(json_dumps({"error": "Authorization header required"}).encode())
            return
            
        token = auth_header.split(" ")[1] if len(auth_header.split(" ")) > 1 else ""
        
        # Get content length
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = None
        
        if content_length > 0:
            # Parse JSON data
            post_data = json.loads(self.rfile.read(content_length))
        
        # Update artwork
        if path.startswith('/artworks/'):
            artwork_id = path.split("/")[-1]
            
            # Only admin or the artist who created the artwork can update it
            auth_result = require_auth(token)
            
            if "error" in auth_result:
                self._set_response(401)
                self.wfile.write(json_dumps(auth_result).encode())
                return
                
            if not post_data:
                self._set_response(400)
                self.wfile.write(json_dumps({"error": "Missing artwork data"}).encode())
                return
                
            # Update the artwork
            result = update_artwork(artwork_id, post_data)
            
            if "error" in result:
                self._set_response(400)
                self.wfile.write(json_dumps(result).encode())
            else:
                self._set_response(200)
                self.wfile.write(json_dumps({"message": "Artwork updated successfully"}).encode())
            return
            
        # Update exhibition
        elif path.startswith('/exhibitions/'):
            exhibition_id = path.split("/")[-1]
            
            # Only admin can update exhibitions
            auth_result = require_auth(token, True)
            
            if "error" in auth_result:
                self._set_response(401)
                self.wfile.write(json_dumps(auth_result).encode())
                return
                
            if not post_data:
                self._set_response(400)
                self.wfile.write(json_dumps({"error": "Missing exhibition data"}).encode())
                return
                
            # Update the exhibition
            result = update_exhibition(exhibition_id, post_data)
            
            if "error" in result:
                self._set_response(400)
                self.wfile.write(json_dumps(result).encode())
            else:
                self._set_response(200)
                self.wfile.write(json_dumps({"message": "Exhibition updated successfully"}).encode())
            return
            
        # Default response for unknown paths
        else:
            self._set_response(404)
            self.wfile.write(json_dumps({"error": "Not found"}).encode())
            return

    def do_DELETE(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        # Check authentication for all DELETE requests
        auth_header = self.headers.get('Authorization')
        if not auth_header:
            self._set_response(401)
            self.wfile.write(json_dumps({"error": "Authorization header required"}).encode())
            return
            
        token = auth_header.split(" ")[1] if len(auth_header.split(" ")) > 1 else ""
        
        # Delete artwork
        if path.startswith('/artworks/'):
            artwork_id = path.split("/")[-1]
            
            # Only admin or the artist who created the artwork can delete it
            auth_result = require_auth(token)
            
            if "error" in auth_result:
                self._set_response(401)
                self.wfile.write(json_dumps(auth_result).encode())
                return
                
            # Delete the artwork
            result = delete_artwork(artwork_id)
            
            if "error" in result:
                self._set_response(400)
                self.wfile.write(json_dumps(result).encode())
            else:
                self._set_response(200)
                self.wfile.write(json_dumps({"message": "Artwork deleted successfully"}).encode())
            return
            
        # Delete exhibition
        elif path.startswith('/exhibitions/'):
            exhibition_id = path.split("/")[-1]
            
            # Only admin can delete exhibitions
            auth_result = require_auth(token, True)
            
            if "error" in auth_result:
                self._set_response(401)
                self.wfile.write(json_dumps(auth_result).encode())
                return
                
            # Delete the exhibition
            result = delete_exhibition(exhibition_id)
            
            if "error" in result:
                self._set_response(400)
                self.wfile.write(json_dumps(result).encode())
            else:
                self._set_response(200)
                self.wfile.write(json_dumps({"message": "Exhibition deleted successfully"}).encode())
            return
            
        # Default response for unknown paths
        else:
            self._set_response(404)
            self.wfile.write(json_dumps({"error": "Not found"}).encode())
            return

def run(server_class=HTTPServer, handler_class=ServerHandler, port=PORT):
    server_address = (HOST, port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting server on {HOST}:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print("Server stopped")

if __name__ == "__main__":
    run()
