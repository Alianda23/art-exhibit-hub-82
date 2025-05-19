
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Artists table
CREATE TABLE IF NOT EXISTS artists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    bio TEXT,
    profile_image_url VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Corporate Users table
CREATE TABLE IF NOT EXISTS corporate_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100),
    tax_id VARCHAR(100),
    billing_address TEXT NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    contact_position VARCHAR(255),
    allow_invoicing BOOLEAN DEFAULT TRUE,
    credit_limit DECIMAL(10, 2),
    discount_rate DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Artworks table
CREATE TABLE IF NOT EXISTS artworks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    artist_id INT,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    dimensions VARCHAR(100),
    medium VARCHAR(100),
    year INT,
    image_url VARCHAR(255),
    status ENUM('available', 'sold') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(id)
);

-- Exhibitions table
CREATE TABLE IF NOT EXISTS exhibitions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    ticket_price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    total_slots INT NOT NULL,
    available_slots INT NOT NULL,
    status ENUM('upcoming', 'ongoing', 'past') NOT NULL DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Artwork Orders table
CREATE TABLE IF NOT EXISTS artwork_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    artwork_id INT NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    delivery_address TEXT,
    payment_method ENUM('mpesa', 'card', 'bank') DEFAULT 'mpesa',
    payment_status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (artwork_id) REFERENCES artworks(id)
);

-- Corporate Artwork Orders table
CREATE TABLE IF NOT EXISTS corporate_artwork_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    corporate_user_id INT NOT NULL,
    artwork_id INT NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    delivery_address TEXT,
    payment_method ENUM('invoice', 'card', 'bank') DEFAULT 'invoice',
    payment_status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    invoice_number VARCHAR(50),
    payment_terms VARCHAR(100),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    FOREIGN KEY (corporate_user_id) REFERENCES corporate_users(id),
    FOREIGN KEY (artwork_id) REFERENCES artworks(id)
);

-- Exhibition Bookings table
CREATE TABLE IF NOT EXISTS exhibition_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    exhibition_id INT NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    ticket_code VARCHAR(50),
    slots INT NOT NULL DEFAULT 1,
    payment_method ENUM('mpesa', 'card', 'bank') DEFAULT 'mpesa',
    payment_status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    status ENUM('active', 'used', 'cancelled') DEFAULT 'active',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (exhibition_id) REFERENCES exhibitions(id)
);

-- Corporate Exhibition Bookings table
CREATE TABLE IF NOT EXISTS corporate_exhibition_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    corporate_user_id INT NOT NULL,
    exhibition_id INT NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    ticket_code VARCHAR(50),
    slots INT NOT NULL DEFAULT 1,
    payment_method ENUM('invoice', 'card', 'bank') DEFAULT 'invoice',
    payment_status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    status ENUM('active', 'used', 'cancelled') DEFAULT 'active',
    invoice_number VARCHAR(50),
    payment_terms VARCHAR(100),
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    FOREIGN KEY (corporate_user_id) REFERENCES corporate_users(id),
    FOREIGN KEY (exhibition_id) REFERENCES exhibitions(id)
);

-- Legacy tables (kept for backward compatibility)
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    exhibition_id INT NOT NULL,
    ticket_code VARCHAR(50) NOT NULL UNIQUE,
    slots INT NOT NULL,
    status ENUM('active', 'used', 'cancelled') NOT NULL DEFAULT 'active',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (exhibition_id) REFERENCES exhibitions(id)
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('artwork', 'exhibition') NOT NULL,
    reference_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
