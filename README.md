# Event Management API

A RESTful API for managing events, user authentication, and RSVPs built with TypeScript, Node.js, Express, and MongoDB.

## Table of Contents

- [Setup and Running Instructions](#setup-and-running-instructions)
- [API Documentation](#api-documentation)
- [Design Decisions and Tradeoffs](#design-decisions-and-tradeoffs)
- [Additional Features](#additional-features)

## Setup and Running Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/event-management-API.git
   cd event-management-API
    ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your MongoDB connection string:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/event-management
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. The API will be available at `http://localhost:3000`.
6. Database Seeding

To populate the database with initial data for testing and development:

```bash
# Seed the database using the default environment
npm run seed
```
The seed script creates:

5 users (including an admin user)
6 events of different categories
8 RSVPs with different statuses

Admin user credentials:

Email: admin@example.com
Password: admin123

Regular user credentials:

Email: john@example.com, jane@example.com, etc.
Password: password123

7. Run tests:
   ```bash
   npm test
   ```

## API Documentation
Authentication Endpoints

Register a new user:
```http
POST /api/auth/register
``` 
Request Body: 
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
Response (201 Created):
```json
{
  "message": "User registered successfully"
}
```
Login a user:
```http
POST /api/auth/login
```
Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
Response (200 OK):

```
json
{
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "tokens": {
    "accessToken": "jwt-token-string",
    "refreshToken": "refresh-token-string"
  }
}
```

Get current user:
```http
GET /api/auth/me
```
Headers:
```http
Authorization: Bearer jwt-token-string
```
Response (200 OK):
```json
{
  "id": "60d21b4667d0d8992e610c85",
  "name": "John Doe",
  "email": "john@example.com"
}
```
Logout a user:
```http
POST /api/auth/logout
```
Response (200 OK):
```json
{
  "message": "User logged out successfully"
}
```
### Event Endpoints
Get all events:
```http
GET /api/event?page=1&limit=10&category=workshop&location=San+Francisco&date=2025-10-15
```
Response (200 OK):
```json
{
  "events": [
    {
      "id": "60d21b4667d0d8992e610c86",
      "title": "JavaScript Workshop",
      "description": "Learn about the latest JavaScript features",
      "date": "2025-04-05T14:00:00.000Z",
      "location": "New York City Tech Hub",
      "organizer": "60d21b4667d0d8992e610c85",
      "category": "workshop",
      "maxAttendees": 50,
      "attendees": ["60d21b4667d0d8992e610c87"]
    }
  ],
  "pagination": {
    "total": 6,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```
Get a specific event:
```http
GET /api/event/:id
```
Response (200 OK):
```json
{
  "id": "60d21b4667d0d8992e610c86",
  "title": "JavaScript Workshop",
  "description": "Learn about the latest JavaScript features",
  "date": "2025-04-05T14:00:00.000Z",
  "location": "New York City Tech Hub",
  "organizer": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe"
  },
  "category": "workshop",
  "maxAttendees": 50,
  "attendees": [
    {
      "id": "60d21b4667d0d8992e610c87",
      "name": "Jane Smith"
    }
  ]
}
```
Create a new event:
```http
POST /api/event
```
Headers:
```http
Authorization: Bearer jwt-token-string
```
Request Body:
```json
{
  "title": "Tech Conference 2025",
  "description": "Annual technology conference",
  "date": "2025-10-15T10:00:00Z",
  "location": "Convention Center",
  "maxAttendees": 500,
  "category": "conference"
}
```
Response (201 Created):
```json
{
  "id": "60d21b4667d0d8992e610c88",
  "title": "Tech Conference 2025",
  "description": "Annual technology conference",
  "date": "2025-10-15T10:00:00.000Z",
  "location": "Convention Center",
  "organizer": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe"
  },
  "category": "conference",
  "maxAttendees": 500,
  "attendees": []
}
```
Update an event:
```http
PUT /api/event/:id
```
Headers:
```http
Authorization: Bearer jwt-token-string
```
Request Body:
```json
{
  "title": "Updated Event Title",
  "description": "Updated event description"
}
```
Response (200 OK):
```json
{
  "id": "60d21b4667d0d8992e610c88",
  "title": "Updated Event Title",
  "description": "Updated event description",
  "date": "2025-10-15T10:00:00.000Z",
  "location": "Convention Center",
  "organizer": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe"
  },
  "category": "conference",
  "maxAttendees": 500,
  "attendees": []
}
```
Delete an event:
```http
DELETE /api/event/:id
```
Headers:
```http
Authorization: Bearer jwt-token-string
```
Response (204 No Content):
```json
{
  "message": "Event deleted successfully"
}
```
### RSVP Endpoints
RSVP to an event:
```http
POST /api/event/:id/rsvp
```
Headers:
```http
Authorization: Bearer jwt-token-string
```
Request Body:
```json
{
  "status": "attending" // or "maybe" or "declined"
}
```
Response (200 OK):
```json
{
  "eventId": "60d21b4667d0d8992e610c88",
  "userId": "60d21b4667d0d8992e610c85",
  "status": "attending",
  "created": "2023-04-19T10:30:00.000Z"
}
```
GET /api/event/:id/attendees
```http
GET /api/event/:id/attendees
```
```json
{
  "attendees": [
    {
      "id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "rsvpStatus": "attending"
    },
    {
      "id": "60d21b4667d0d8992e610c87",
      "name": "Jane Smith",
      "rsvpStatus": "maybe"
    }
  ]
}
```
GET events the current user is attending:
```http
GET /api/users/me/events
```
Headers:
```http
Authorization: Bearer jwt-token-string
```
Response (200 OK):
```json
{
  "events": [
    {
      "id": "60d21b4667d0d8992e610c88",
      "title": "Tech Conference 2025",
      "date": "2025-10-15T10:00:00.000Z",
      "location": "Convention Center",
      "status": "attending"
    }
  ]
}
```
## Design Decisions and Tradeoffs
- **Framework**: Chose Express.js for its simplicity and flexibility in building RESTful APIs.
- **Database**: MongoDB was selected for its scalability and ease of use with JSON-like documents.
- **Authentication**: Implemented JWT for stateless authentication, allowing easy scaling and session management.
- **Error Handling**: Centralized error handling middleware to manage errors consistently across the application.
- **Validation**: Used Joi for request validation to ensure data integrity and provide clear error messages.
- **Testing**: Chose Jest for unit and integration testing due to its simplicity and built-in mocking capabilities.
- **Environment Variables**: Used dotenv for managing environment variables, allowing easy configuration for different environments (development, testing, production).
- **Logging**: Integrated Winston for logging, providing a structured way to log application events and errors.
- **Pagination**: Implemented pagination for event listing to improve performance and user experience.
- **Separation of Concerns**: Organized the codebase into controllers, models, routes, and middleware to maintain a clean architecture and improve maintainability.

## Future Improvements
- **Error handling**: currently some routes lack comprehensive error handling, implement centralized error handling _middleware_ to manage errors consistently across the application
- **Input validation**: currently input sanitization is limited, improve input validation using existing _Zod_ dependency
  - TODO: add validation for query parameters and path parameters
- **Authentication & Authorization**: currently only basic authentication is implemented and automatic setting of HTTP headers using _Helmet_, add CORS, use HTTPS, implement rate-limiting and input sanitization for bolstering security
  - TODO: add JWT Security Headers
- **Logging**: prominently feature logging using _Winston_ for better monitoring and debugging
  - TODO: add separate loggers for different concerns (e.g. services, controllers, etc.)
- **API Documentation**: currently limited, use _Swagger_ or _Postman_ for comprehensive API documentation, facilitating easier onboarding and collaboration
- **Environment management**: currently handled locally, use _dotenv_ for managing environment variables, ensuring sensitive information is not hard-coded
- **Db schema**: currently no explicit schema is illustrated, use _dbdiagram.io_ or _MongoDB Compass_ for visualizing the database schema
- **Scalability concerns**: improve API to handle increased loads and concurrent users w/ efficient database queries and caching strategies as well as modular code structure
- **Plan breakdown into microservices**: currently all deployed as a monolith, consider breaking down into microservices for scalability and maintainability
- **Extend integration tests**: currently limited to schema validation, extend integration tests to cover all endpoints and edge cases
- **Plan cloud deployment (CI/CD)**: currently hosted locally, consider deploying to a cloud provider (e.g., _AWS_, _Azure_) for better scalability and availability and defining a CI/CD pipeline using _GitHub Actions_ or _CirleCI_
- **Measure & Improve performance**: currently no performance metrics, consider using _New Relic_ or _Datadog_ for monitoring and improving performance