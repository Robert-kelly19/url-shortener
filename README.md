URL Shortener Project


Overview

This project is a URL shortener application that allows users to register, log in, and create shortened URLs that redirect to original long URLs. Built with Node.js, Express, and PostgreSQL, the application adheres to RESTful API principles.

Features
User Registration and Login: Users can create accounts and log in securely.
URL Shortening: Users can shorten long URLs and optionally provide custom short codes.
Expiration Dates: Users can set expiration dates for their shortened URLs.
User-Specific URL Management: Users can view their own shortened URLs.
Token-Based Authentication: JWT is used for secure authentication.
Logging: The application logs important actions and errors.
Technologies Used
Node.js: JavaScript runtime for the server.
Express: Web framework for building the API.
PostgreSQL: Database for storing user and URL data.
Joi: For input validation.
bcryptjs: For password hashing.
jsonwebtoken: For token management.
nanoid: For generating unique short codes.


Getting Started
Prerequisites
Node.js (v14 or higher)
PostgreSQL (v12 or higher)
A .env file for environment variables
Installation
Clone the repository:

git clone https://github.com/your-username/url-shortener.git
cd url-shortener
Install dependencies:

bash

Copy
npm install
Set up the database:

Create a PostgreSQL database.
Update the .env file with your database credentials:
plaintext

PGUSER=your_db_user
PGPASSWORD=your_db_password
PGHOST=localhost
PGNAME=your_db_name
PGPORT=5432
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
BASE_URL=http://localhost:3000
Run database migrations:

Initialize the database schema by running:

bash

node -r dotenv/config ./path/to/initialization/script.js
Start the server:

bash

npm start
The server will run at http://localhost:3000.

API Endpoints
User Registration
POST /auth/userRegister

Request Body:
json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "yourpassword",
  "confirmPassword": "yourpassword"
}
User Login
POST /auth/userLogin

Request Body:
json


{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
Shorten URL
POST /api/url/shorten

Request Body:
json

{
  "longUrl": "http://example.com",
  "customCode": "custom123", // optional
  "expiresAt": "2023-12-31T23:59:59Z" // optional
}
Get User URLs
GET /api/url/my-urls
Redirect Shortened URL
GET /s/:shortCode
Authentication Middleware
This application uses JWT for authentication. The token must be included in the Authorization header as follows:



Authorization: Bearer <token>
Error Handling
The application includes error handling for various scenarios, such as invalid input, unauthorized access, and database errors.

Logging
The project uses a logging utility to track important events and errors, facilitating debugging and maintenance.

Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.
Create a new branch (git checkout -b feature/YourFeature).
Make your changes.
Commit your changes (git commit -m 'Add new feature').
Push to the branch (git push origin feature/YourFeature).
Open a pull request.
License
This project is licensed under the MIT License.
