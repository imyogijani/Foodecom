# Backend API Documentation

## Overview
This document provides an overview of the backend API for the Foodecom project. The backend is built using Node.js, Express, and MongoDB, and it handles user authentication and management.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd Foodecom/backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the `backend` directory and add the following variables:
   ```
   MONGODB_URI=<your_mongodb_connection_string>
   PORT=5000
   ```

4. **Start the Server**
   ```bash
   npm start
   ```

## API Endpoints

### User Registration
- **Endpoint:** `POST /api/register`
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string",
    "role": "string" // Optional, defaults to "user"
  }
  ```
- **Response:**
  - **201 Created**
    ```json
    {
      "user": {
        "username": "string",
        "role": "string"
      }
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "message": "Error message"
    }
    ```

### User Login
- **Endpoint:** `POST /api/login`
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response:**
  - **200 OK**
    ```json
    {
      "user": {
        "username": "string",
        "role": "string"
      }
    }
    ```
  - **401 Unauthorized**
    ```json
    {
      "message": "Invalid credentials"
    }
    ```

## Usage Examples

### Register a New User
```bash
curl -X POST http://localhost:5000/api/register -H "Content-Type: application/json" -d '{"username": "testuser", "password": "password123"}'
```

### Login a User
```bash
curl -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username": "testuser", "password": "password123"}'
```

## Additional Information
- Ensure MongoDB is running and accessible via the connection string provided in the `.env` file.
- The server listens on the port specified in the `.env` file (default is 5000).