# Event Management API - Take-Home Project

## Project Overview

Create a RESTful API for an event management system where users can create, manage, and RSVP to events. This backend-only project will evaluate your skills with TypeScript, Node.js, MongoDB, Jest, and Zod schemas.

## Requirements

### Core Functionality
1. Create a complete API with the following features:
   - User authentication (signup, login, logout)
   - Event management (create, read, update, delete)
   - RSVP functionality (users can RSVP to events)
   - Search/filter events by date, category, or location

### Technical Requirements
- Use TypeScript for type safety
- Build on Node.js (Express or NestJS recommended)
- Use MongoDB for data storage
- Implement proper validation with Zod schemas
- Write comprehensive tests with Jest (aim for >80% coverage)
- Include proper error handling and logging
- Add pagination for list endpoints

## Project Structure

Here's a suggested structure (adapt as you see fit):

```
├── src/
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── schemas/            # Zod validation schemas
│   ├── services/           # Business logic
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Helper functions
│   └── app.ts              # Express/NestJS app
├── tests/
│   ├── integration/        # Integration tests
│   └── unit/               # Unit tests
├── .env.example            # Example environment variables
├── jest.config.js          # Jest configuration
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## Data Models

At minimum, implement:

1. User
   - Name, email, password (hashed), profile info

2. Event
   - Title, description, location, date/time, category, owner (user reference), attendees, capacity, etc.

3. RSVP
   - User reference, event reference, status (attending/maybe/declined), timestamp

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Events
- `GET /api/events` - Get all events (with pagination and filters)
- `GET /api/events/:id` - Get a specific event
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event

### RSVPs
- `POST /api/events/:id/rsvp` - RSVP to an event
- `GET /api/events/:id/attendees` - Get event attendees
- `GET /api/users/me/events` - Get events the current user is attending

## Evaluation Criteria

Your solution will be evaluated on:

1. **Code Quality**
   - Clean, maintainable, and well-documented code
   - Proper error handling and edge cases
   - Effective use of TypeScript features

2. **Architecture**
   - Separation of concerns
   - RESTful API design
   - Proper use of middleware

3. **Security**
   - Authentication and authorization
   - Input validation
   - Protection against common vulnerabilities

4. **Testing**
   - Comprehensive test coverage
   - Clear test organization and descriptions

5. **Data Modeling**
   - Appropriate schema design
   - Effective use of MongoDB features
   - Proper validation with Zod

## Submission Instructions

1. Create a private GitHub repository
2. Implement your solution
3. Include a README with:
   - Setup and running instructions
   - API documentation
   - Design decisions and tradeoffs
   - Any additional features implemented
4. Provide a seed script for initial data
5. Share the repository with [interviewer's GitHub username]

If you have any questions during the assignment, please reach out to us.