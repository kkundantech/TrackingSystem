# LogiTrack - Logistics Tracking System

A modern web application for tracking shipments and managing logistics operations. Built with HTML, CSS, JavaScript, PHP, and MySQL.

## Features

- User registration and authentication with email verification
- Real-time shipment tracking
- Search shipments by Tracking ID or Order ID
- User profile management (change username and password)
- Responsive design for all devices
- Secure session management
- Clean and modern UI

## Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache/Nginx)
- Modern web browser

## Installation

1. Clone the repository to your web server directory:
   ```bash
   git clone https://github.com/yourusername/logitrack.git
   ```

2. Create a MySQL database named `logistics_db` (or update the database name in `php/config.php`)

3. Import the database schema:
   ```bash
   mysql -u your_username -p logistics_db < database.sql
   ```

4. Configure your web server to point to the project directory

5. Update the database configuration in `php/config.php`:
   ```php
   define('DB_SERVER', 'localhost');
   define('DB_USERNAME', 'your_username');
   define('DB_PASSWORD', 'your_password');
   define('DB_NAME', 'logistics_db');
   ```

6. For email functionality, configure your PHP mail settings or update the email configuration in the registration process

## Usage

1. Open the application in your web browser
2. Register a new account
3. Verify your email address
4. Log in to access the dashboard
5. Track your shipments using the search functionality

## Security Features

- Password hashing using PHP's built-in functions
- Prepared statements to prevent SQL injection
- Input validation and sanitization
- Session management
- CSRF protection
- XSS prevention

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Modern CSS techniques for responsive design 