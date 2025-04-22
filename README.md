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
  "token": "jwt-token-string"
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
Response (204 No Content): // TODO: note CONFIRM
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
```markdown
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

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configuration (MongoDB URI, JWT secret, etc)

### Running the Application

```bash
# Development mode with hot-reload
npm run dev

# Production build
npm run build
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Database Seeding

To populate the database with initial data for testing and development:

```bash
# Seed the database
npm run seed
```

The seed script creates:
- 5 users (including an admin user)
- 6 events of different categories
- 8 RSVPs with different statuses

Admin user credentials:
- Email: admin@example.com
- Password: admin123

Regular user credentials:
- Email: john@example.com, jane@example.com, etc.
- Password: password123

## API Documentation

### Authentication Endpoints

#### Register a new user
```
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
  "message": "User registered successfully",
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login
```
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
```json
{
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt-token-string"
}
```

#### Get current user
```
GET /api/auth/me
```

Headers:
```
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

#### Logout
```
POST /api/auth/logout
```

Response (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

### Event Endpoints

#### Get all events
```
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

#### Get a specific event
```
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

#### Create a new event
```
POST /api/event
```

Headers:
```
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
  "organizer": "60d21b4667d0d8992e610c85",
  "category": "conference",
  "maxAttendees": 500,
  "attendees": []
}
```

#### Update an event
```
PUT /api/event/:id
```

Headers:
```
Authorization: Bearer jwt-token-string
```

Request Body:
```json
{
  "title": "Updated Tech Conference 2025",
  "description": "Updated description"
}
```

Response (200 OK):
```json
{
  "id": "60d21b4667d0d8992e610c88",
  "title": "Updated Tech Conference 2025",
  "description": "Updated description",
  "date": "2025-10-15T10:00:00.000Z",
  "location": "Convention Center",
  "organizer": "60d21b4667d0d8992e610c85",
  "category": "conference",
  "maxAttendees": 500,
  "attendees": []
}
```

#### Delete an event
```
DELETE /api/event/:id
```

Headers:
```
Authorization: Bearer jwt-token-string
```

Response (200 OK):
```json
{
  "message": "Event deleted successfully"
}
```

### RSVP Endpoints

#### RSVP to an event
```
POST /api/event/:id/rsvp
```

Headers:
```
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

#### Get event attendees
```
GET /api/event/:id/attendees
```

Response (200 OK):
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

#### Get user's events
```
GET /api/users/me/events
```

Headers:
```
Authorization: Bearer jwt-token-string
```

Response (200 OK):
```json
{
  "events": [
    {
      "id": "60d21b4667d0d8992e610c86",
      "title": "JavaScript Workshop",
      "date": "2025-04-05T14:00:00.000Z",
      "location": "New York City Tech Hub",
      "category": "workshop",
      "rsvpStatus": "attending"
    }
  ]
}
```

## Design Decisions and Tradeoffs

### Architecture

- **MVC Pattern** - Used a Model-View-Controller pattern for clear separation of concerns, making the codebase more maintainable and testable.
- **Service Layer** - Added a service layer between controllers and models to encapsulate business logic.
- **Repository Pattern** - Used repositories to abstract database operations, making it easier to switch database providers if needed.

### Authentication

- **JWT-based Authentication** - Chose JWT tokens for stateless authentication, providing a good balance between security and performance.
- **Token Storage** - Used HTTP-only cookies for token storage to mitigate XSS vulnerabilities while still allowing for auth persistence.
- **Refresh Tokens** - Implemented refresh tokens with shorter-lived access tokens for enhanced security.

### Database

- **MongoDB Schema Design** - Optimized schemas for query performance, especially for filtered event searches.
- **Indexed Fields** - Added indexes to frequently queried fields (event date, category, location) to improve search performance.
- **Referential Integrity** - Used references between collections rather than embedding for RSVPs to prevent data duplication.

### Validation

- **Zod Schemas** - Used Zod for input validation and type safety, ensuring request data matches expected formats.
- **Middleware Validation** - Applied validation middleware to routes to catch invalid requests early.

### Error Handling

- **Centralized Error Handler** - Implemented a global error handler for consistent error responses.
- **Custom Error Classes** - Created custom error classes for different types of errors (authentication, validation, not found, etc.).

### API Design Tradeoffs

- **Query Parameters vs. Request Body** - Used query parameters for filtering/pagination and request body for data creation/updates.
- **Resources Naming** - Chose singular naming for resources (/api/event) for consistency.
- **Pagination** - Implemented cursor-based pagination for efficient handling of large datasets.

## Additional Features

### Comprehensive Logging

- Implemented structured logging with different log levels for development and production environments.
- Added request ID tracking for better debugging capabilities.

### Advanced Search and Filtering

- Extended the event search functionality with full-text search capabilities.
- Added support for multiple filter combinations (date ranges, categories, locations).

### Rate Limiting

- Implemented API rate limiting to prevent abuse and ensure service stability.
- Different rate limits for authenticated and unauthenticated users.

### Optimistic Concurrency Control

- Added version control for events to prevent conflicts when multiple users edit the same event.

### Event Capacity Management

- Automatically manages event capacity when users RSVP.
- Prevents RSVPs when an event reaches maximum capacity.

### Soft Delete

- Implemented soft delete for events so they can be restored if accidentally deleted.

### Event Reminders

- Added functionality to send reminders to attendees before events (via background tasks).

### Swagger Documentation

- Integrated Swagger/OpenAPI documentation for interactive API exploration.


