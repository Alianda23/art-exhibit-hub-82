from flask import Flask, request, jsonify, send_from_directory, make_response
from flask_cors import CORS
import os
from database import get_db_connection
import auth
import contact
import artwork
import exhibition
import mpesa
from middleware import token_required
from db_operations import (
    create_order, get_all_orders, get_all_tickets,
    get_user_orders, get_artist_artworks, get_artist_orders,
    get_all_artists
)

app = Flask(__name__, static_folder='static')
CORS(app)

# Auth routes
@app.route('/register', methods=['POST'])
def register():
    return auth.register_user()

@app.route('/register-artist', methods=['POST'])
def register_artist():
    return auth.register_artist()

@app.route('/login', methods=['POST'])
def login():
    return auth.login_user()

@app.route('/artist-login', methods=['POST'])
def artist_login():
    return auth.login_artist()

@app.route('/admin-login', methods=['POST'])
def admin_login():
    return auth.login_admin()

# Contact routes
@app.route('/contact', methods=['POST'])
def contact_form():
    return contact.submit_contact_form()

@app.route('/messages', methods=['GET'])
@token_required
def get_messages():
    if not request.user.get('is_admin', False):
        return jsonify({"error": "Unauthorized access"}), 403
    return contact.get_all_contact_messages()

@app.route('/messages/<message_id>', methods=['PUT'])
@token_required
def update_message_status(message_id):
    if not request.user.get('is_admin', False):
        return jsonify({"error": "Unauthorized access"}), 403
    return contact.update_contact_message_status(message_id)

# Artwork routes
@app.route('/artworks', methods=['POST'])
@token_required
def create_artwork():
    return artwork.create_new_artwork()

@app.route('/artworks/<artwork_id>', methods=['GET'])
def get_artwork(artwork_id):
    return artwork.get_artwork_by_id(artwork_id)

@app.route('/artworks', methods=['GET'])
def get_artworks():
    return artwork.get_all_artworks()

@app.route('/artworks/<artwork_id>', methods=['PUT'])
@token_required
def update_artwork(artwork_id):
    return artwork.update_existing_artwork(artwork_id)

@app.route('/artworks/<artwork_id>', methods=['DELETE'])
@token_required
def delete_artwork(artwork_id):
    return artwork.delete_existing_artwork(artwork_id)

# Exhibition routes
@app.route('/exhibitions', methods=['POST'])
@token_required
def create_exhibition():
    return exhibition.create_new_exhibition()

@app.route('/exhibitions/<exhibition_id>', methods=['GET'])
def get_exhibition(exhibition_id):
    return exhibition.get_exhibition_by_id(exhibition_id)

@app.route('/exhibitions', methods=['GET'])
def get_exhibitions():
    return exhibition.get_all_exhibitions()

@app.route('/exhibitions/<exhibition_id>', methods=['PUT'])
@token_required
def update_exhibition(exhibition_id):
    return exhibition.update_existing_exhibition(exhibition_id)

@app.route('/exhibitions/<exhibition_id>', methods=['DELETE'])
@token_required
def delete_exhibition(exhibition_id):
    return exhibition.delete_existing_exhibition(exhibition_id)

# M-Pesa routes
@app.route('/mpesa/stk-push', methods=['POST'])
def stk_push():
    return mpesa.initiate_stk_push()

@app.route('/mpesa/status/<checkout_request_id>', methods=['GET'])
def check_stk_status(checkout_request_id):
    return mpesa.check_transaction_status(checkout_request_id)

# Orders routes
@app.route('/orders/artwork', methods=['POST'])
@token_required
def place_artwork_order():
    return mpesa.place_artwork_order_route()

@app.route('/orders/exhibition', methods=['POST'])
@token_required
def book_exhibition():
    return mpesa.book_exhibition_route()

@app.route('/tickets/generate/<booking_id>', methods=['GET'])
@token_required
def generate_ticket(booking_id):
    return mpesa.generate_exhibition_ticket_route(booking_id)

@app.route('/tickets/user/<user_id>', methods=['GET'])
@token_required
def get_user_tickets(user_id):
    return mpesa.get_user_tickets_route(user_id)

@app.route('/orders', methods=['GET'])
@token_required
def get_orders():
    if not request.user.get('is_admin', False):
        return jsonify({"error": "Unauthorized access"}), 403
    result = get_all_orders()
    if "error" in result:
        return jsonify({"error": result["error"]}), 400
    return jsonify(result)

@app.route('/tickets', methods=['GET'])
@token_required
def get_tickets():
    if not request.user.get('is_admin', False):
        return jsonify({"error": "Unauthorized access"}), 403
    result = get_all_tickets()
    if "error" in result:
        return jsonify({"error": result["error"]}), 400
    return jsonify(result)

@app.route('/orders/user/<user_id>', methods=['GET'])
@token_required
def get_user_orders_endpoint(user_id):
    # Ensure the user can only access their own orders
    if str(request.user['sub']) != str(user_id) and not request.user.get('is_admin', False):
        return jsonify({"error": "Unauthorized access"}), 403
    
    result = get_user_orders(user_id)
    
    if "error" in result:
        return jsonify({"error": result["error"]}), 400
    
    return jsonify(result)

@app.route('/artist/artworks', methods=['GET'])
@token_required
def get_artist_artworks_endpoint():
    artist_id = request.user.get('artist_id')
    if not artist_id:
        return jsonify({"error": "Artist ID not found"}), 400
    result = get_artist_artworks(artist_id)
    if "error" in result:
        return jsonify({"error": result["error"]}), 400
    return jsonify(result)

@app.route('/artist/orders', methods=['GET'])
@token_required
def get_artist_orders_endpoint():
    artist_id = request.user.get('artist_id')
    if not artist_id:
        return jsonify({"error": "Artist ID not found"}), 400
    result = get_artist_orders(artist_id)
    if "error" in result:
        return jsonify({"error": result["error"]}), 400
    return jsonify(result)

@app.route('/artists', methods=['GET'])
@token_required
def get_artists():
    if not request.user.get('is_admin', False):
        return jsonify({"error": "Unauthorized access"}), 403
    result = get_all_artists()
    if "error" in result:
        return jsonify({"error": result["error"]}), 400
    return jsonify(result)

# Static files route for serving images
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
