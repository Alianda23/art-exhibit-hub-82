
# Add this route to your server.py file in the do_POST method section

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
