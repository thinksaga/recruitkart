# API Documentation

This directory contains comprehensive documentation for all Recruitkart API endpoints.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

All authenticated endpoints require a JWT token stored in an httpOnly cookie.

```http
Cookie: token=<jwt_token>
```

## API Structure

```
/api
├── /auth              # Authentication endpoints
│   ├── /login        # User login
│   ├── /logout       # User logout
│   ├── /signup       # User registration
│   └── /me           # Get current user
├── /users            # User management
├── /organizations    # Organization management
├── /jobs             # Job management
├── /candidates       # Candidate management
├── /submissions      # Submission management
├── /interviews       # Interview management
└── /tickets          # Support tickets
```

## Documentation Files

- [Authentication](./authentication.md) - Login, logout, signup, password reset
- [Users](./users.md) - User CRUD operations
- [Organizations](./organizations.md) - Company management
- [Jobs](./jobs.md) - Job posting and management
- [Candidates](./candidates.md) - Candidate profiles
- [Submissions](./submissions.md) - Candidate submissions
- [Interviews](./interviews.md) - Interview scheduling
- [Tickets](./tickets.md) - Support ticketing

## Response Format

### Success Response

```json
{
  "data": { ... },
  "message": "Success message"
}
```

### Error Response

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

## Rate Limiting

API endpoints are rate-limited using Redis:

- **Default**: 100 requests per minute per IP
- **Authentication**: 5 requests per minute per IP
- **Sensitive operations**: 10 requests per minute per user

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

## Pagination

List endpoints support pagination:

```http
GET /api/jobs?page=1&limit=20
```

Response includes pagination metadata:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Filtering & Sorting

```http
GET /api/jobs?status=OPEN&sort=-created_at
```

- Use `sort` parameter with field name
- Prefix with `-` for descending order

## Common Headers

```http
Content-Type: application/json
Accept: application/json
```

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_CREDENTIALS` | Invalid email or password |
| `UNAUTHORIZED` | Missing or invalid token |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Request validation failed |
| `DUPLICATE_ENTRY` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |

## Examples

See individual endpoint documentation for detailed examples and request/response schemas.
