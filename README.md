# Event Management System

A Node.js application for managing events at FPT University Da Nang.

## Features

- User authentication with JWT
- Role-based access control (Admin/Student)
- Event registration management
- Real-time notifications for new registrations

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/event_management
   JWT_SECRET=your_jwt_secret_key_here
   ```

## Running the Application

1. Start MongoDB service
2. Run the application:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- POST /auth/login
  - Body: { "username": "string", "password": "string" }
  - Returns: JWT token and user information

### Registrations (Student)
- POST /registrations
  - Body: { "eventId": "string" }
  - Headers: Authorization: Bearer <token>
  - Role: Student

- DELETE /registrations/:registrationId
  - Headers: Authorization: Bearer <token>
  - Role: Student

### Registrations (Admin)
- GET /registrations/listRegistrations
  - Query params: page, limit
  - Headers: Authorization: Bearer <token>
  - Role: Admin

- GET /registrations/getRegistrationsByDate
  - Query params: startDate, endDate
  - Headers: Authorization: Bearer <token>
  - Role: Admin

## Project Structure

```
├── controllers/
│   ├── authController.js
│   └── registrationController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── userModel.js
│   └── registrationModel.js
├── routes/
│   ├── authRoutes.js
│   └── registrationRoutes.js
├── app.js
├── package.json
└── README.md
``` 