-- Create the database
CREATE DATABASE IF NOT EXISTS logitrack;
USE logitrack;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    phone_number VARCHAR(20) NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    mrp DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(50) NOT NULL UNIQUE,
    user_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    order_date DATE NOT NULL,
    shipping_address_id INT,
    status VARCHAR(20) NOT NULL,
    total_shipments INT NOT NULL DEFAULT 1,
    current_shipment INT NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (shipping_address_id) REFERENCES addresses(id)
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Create shipments table
CREATE TABLE IF NOT EXISTS shipments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    tracking_id VARCHAR(50) UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    items_count INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    delivery_date DATE,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Create shipment_tracking table
CREATE TABLE IF NOT EXISTS shipment_tracking (
    tracking_id INT AUTO_INCREMENT PRIMARY KEY,
    shipment_id INT,
    status VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    description TEXT,
    tracking_date TIMESTAMP NOT NULL,
    FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
);

-- Insert sample users
INSERT INTO users (username, email, password_hash) VALUES
('John Doe', 'john.doe@example.com', '$2a$10$X7UrE9N9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9Zq'),
('Jane Smith', 'jane.smith@example.com', '$2a$10$X7UrE9N9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9Zq'),
('Robert Johnson', 'robert.johnson@example.com', '$2a$10$X7UrE9N9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9Zq');

-- Insert sample addresses
INSERT INTO addresses (customer_name, street_address, city, state, postal_code, phone_number)
VALUES ('Khushi Thakur', '01 Village Patera', 'Bhota', 'Himachal Pradesh', '177401', '9015189448');

-- Insert Prashant's addresses
INSERT INTO addresses (customer_name, street_address, city, state, postal_code, phone_number)
VALUES 
('Prashant rana', 'Boys Hostel 4, Block 51, Lovely Professional University', 'JALANDHAR', 'PUNJAB', '144411', NULL),
('Prashant rana', 'Boys Hostel 4, Block 51, Lovely Professional University, Delhi Gt Road', 'JALANDHAR', 'PUNJAB', '144411', NULL);

-- Insert sample products
INSERT INTO products (name, description, mrp) VALUES
('Smartphone X', 'Latest smartphone with advanced features', 699.99),
('Laptop Pro', 'High-performance laptop for professionals', 1299.99),
('Wireless Earbuds', 'Premium wireless earbuds with noise cancellation', 149.99),
('Smart Watch', 'Fitness tracker and smartwatch in one', 199.99);

-- Insert sample orders
INSERT INTO orders (order_id, total_amount, order_date, shipping_address_id, status, total_shipments)
VALUES ('NYK-247761089-1926200', 1876.00, '2023-12-30', 
    (SELECT id FROM addresses WHERE customer_name = 'Khushi Thakur'), 
    'processing', 2);

-- Insert Prashant's orders
INSERT INTO orders (order_id, total_amount, order_date, shipping_address_id, status, total_shipments)
VALUES 
('404-9351544-7478729', 399.00, '2025-04-10',
    (SELECT id FROM addresses WHERE customer_name = 'Prashant rana' AND street_address NOT LIKE '%Delhi Gt Road%'),
    'processing', 1),
('404-4356617-4379543', 268.00, '2025-04-10',
    (SELECT id FROM addresses WHERE customer_name = 'Prashant rana' AND street_address LIKE '%Delhi Gt Road%'),
    'processing', 1);

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 3, 1, 49.99),
(2, 4, 1, 79.99),
(3, 3, 1, 149.99),
(4, 2, 1, 1299.99);

-- Insert sample shipments
INSERT INTO shipments (
    order_id,
    tracking_id,
    amount,
    items_count,
    status,
    delivery_date
)
VALUES (
    (SELECT id FROM orders WHERE order_id = 'NYK-247761089-1926200'),
    'TRK-123789',
    284.00,
    1,
    'delivered',
    CURRENT_DATE
);

-- Insert Prashant's shipments
INSERT INTO shipments (
    order_id,
    tracking_id,
    amount,
    items_count,
    status,
    delivery_date
)
VALUES 
(
    (SELECT id FROM orders WHERE order_id = '404-9351544-7478729'),
    'TRK-987654',
    399.00,
    1,
    'processing',
    NULL
),
(
    (SELECT id FROM orders WHERE order_id = '404-4356617-4379543'),
    'TRK-456789',
    268.00,
    1,
    'processing',
    NULL
);

-- Insert sample shipment tracking
INSERT INTO shipment_tracking (shipment_id, status, location, description, tracking_date)
VALUES 
((SELECT id FROM shipments WHERE tracking_id = 'TRK-123789'), 'Order placed', 'Bhota, HP', 'Order has been placed', '2023-12-30 10:30:00'),
((SELECT id FROM shipments WHERE tracking_id = 'TRK-123789'), 'Order confirmed', 'Bhota, HP', 'Order has been confirmed', '2023-12-30 11:15:00'),
((SELECT id FROM shipments WHERE tracking_id = 'TRK-123789'), 'Delivered', 'Bhota, HP', 'Package has been delivered', CURRENT_DATE);

-- Insert Prashant's shipment tracking
INSERT INTO shipment_tracking (shipment_id, status, location, description, tracking_date)
VALUES 
((SELECT id FROM shipments WHERE tracking_id = 'TRK-987654'), 'Order placed', 'Jalandhar, PUNJAB', 'Order has been placed', '2025-04-10 10:00:00'),
((SELECT id FROM shipments WHERE tracking_id = 'TRK-987654'), 'Order confirmed', 'Jalandhar, PUNJAB', 'Order has been confirmed', '2025-04-10 10:30:00'),
((SELECT id FROM shipments WHERE tracking_id = 'TRK-456789'), 'Order placed', 'Jalandhar, PUNJAB', 'Order has been placed', '2025-04-10 10:00:00'),
((SELECT id FROM shipments WHERE tracking_id = 'TRK-456789'), 'Order confirmed', 'Jalandhar, PUNJAB', 'Order has been confirmed', '2025-04-10 10:30:00');