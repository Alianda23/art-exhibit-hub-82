
-- Initialize the database schema

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS artists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    phone VARCHAR(20),
    bio TEXT,
    profile_image_url VARCHAR(255) DEFAULT '/static/uploads/placeholder.jpg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS corporate_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    phone VARCHAR(20),
    company_name VARCHAR(200) NOT NULL,
    registration_number VARCHAR(50),
    tax_id VARCHAR(50),
    billing_address TEXT NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    contact_position VARCHAR(100),
    allow_invoicing BOOLEAN DEFAULT FALSE,
    credit_limit DECIMAL(10, 2) DEFAULT 0,
    discount_rate DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS artworks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    artist VARCHAR(100) NOT NULL,
    artist_id INTEGER REFERENCES artists(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    dimensions VARCHAR(100),
    medium VARCHAR(100),
    year INTEGER,
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exhibitions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(100) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    ticket_price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255) NOT NULL DEFAULT '/static/uploads/default_exhibition.jpg',
    total_slots INTEGER NOT NULL,
    available_slots INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS artwork_orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    corporate_user_id INTEGER REFERENCES corporate_users(id) ON DELETE SET NULL,
    artwork_id INTEGER REFERENCES artworks(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    delivery_address TEXT NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    checkout_request_id VARCHAR(50),
    mpesa_receipt_number VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS exhibition_bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    corporate_user_id INTEGER REFERENCES corporate_users(id) ON DELETE SET NULL,
    exhibition_id INTEGER REFERENCES exhibitions(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    slots INTEGER NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    checkout_request_id VARCHAR(50),
    mpesa_receipt_number VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS exhibition_tickets (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES exhibition_bookings(id) ON DELETE SET NULL,
    ticket_code VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    message TEXT NOT NULL,
    source VARCHAR(50) DEFAULT 'website',
    status VARCHAR(20) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_artworks_artist_id ON artworks(artist_id);
CREATE INDEX IF NOT EXISTS idx_artwork_orders_artwork_id ON artwork_orders(artwork_id);
CREATE INDEX IF NOT EXISTS idx_artwork_orders_user_id ON artwork_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_artwork_orders_corporate_user_id ON artwork_orders(corporate_user_id);
CREATE INDEX IF NOT EXISTS idx_exhibition_bookings_exhibition_id ON exhibition_bookings(exhibition_id);
CREATE INDEX IF NOT EXISTS idx_exhibition_bookings_user_id ON exhibition_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_exhibition_bookings_corporate_user_id ON exhibition_bookings(corporate_user_id);
CREATE INDEX IF NOT EXISTS idx_exhibition_tickets_booking_id ON exhibition_tickets(booking_id);
