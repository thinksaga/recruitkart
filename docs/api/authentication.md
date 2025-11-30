# Authentication API

## Overview

The authentication system uses JWT tokens stored in httpOnly cookies for secure session management.

## Endpoints

### POST /api/auth/login

Authenticate a user and create a session.

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@recruitkart.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "admin@recruitkart.com",
    "role": "ADMIN",
    "verificationStatus": "VERIFIED"
  }
}
```

**Response Headers:**
```http
Set-Cookie: token=<jwt_token>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400
```

**Errors:**
- `401 Unauthorized` - Invalid credentials
- `400 Bad Request` - Validation error

---

### POST /api/auth/logout

End the current session.

**Request:**
```http
POST /api/auth/logout
Cookie: token=<jwt_token>
```

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

**Response Headers:**
```http
Set-Cookie: token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0
```

---

### POST /api/auth/signup

Register a new user account.

**Request:**
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "role": "CANDIDATE",
  "fullName": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "message": "Account created successfully",
  "user": {
    "id": "uuid",
    "email": "newuser@example.com",
    "role": "CANDIDATE",
    "verificationStatus": "PENDING"
  }
}
```

**Errors:**
- `409 Conflict` - Email already exists
- `400 Bad Request` - Validation error

---

### GET /api/auth/me

Get the currently authenticated user.

**Request:**
```http
GET /api/auth/me
Cookie: token=<jwt_token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@recruitkart.com",
    "role": "ADMIN",
    "verificationStatus": "VERIFIED",
    "organizationId": "uuid",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Errors:**
- `401 Unauthorized` - Invalid or missing token

---

### POST /api/auth/forgot-password

Request a password reset email.

**Request:**
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset email sent"
}
```

---

### POST /api/auth/reset-password

Reset password using a reset token.

**Request:**
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token",
  "password": "NewSecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successful"
}
```

**Errors:**
- `400 Bad Request` - Invalid or expired token

---

## JWT Token Structure

```json
{
  "userId": "uuid",
  "role": "ADMIN",
  "organizationId": "uuid",
  "verificationStatus": "VERIFIED",
  "iat": 1234567890,
  "exp": 1234654290
}
```

## Security Features

- **httpOnly Cookies**: Prevents XSS attacks
- **Secure Flag**: HTTPS only in production
- **SameSite**: CSRF protection
- **Password Hashing**: bcrypt with salt rounds
- **Token Expiry**: 24 hours
- **Rate Limiting**: 5 login attempts per minute

## Role-Based Redirects

After login, users are redirected based on their role:

| Role | Redirect |
|------|----------|
| ADMIN | `/admin` |
| SUPPORT | `/support` |
| OPERATOR | `/operator` |
| COMPANY_ADMIN | `/dashboard/company` |
| COMPANY_MEMBER | `/dashboard/member` |
| INTERVIEWER | `/dashboard/interviewer` |
| DECISION_MAKER | `/dashboard/decision-maker` |
| TAS | `/tas` |
| CANDIDATE | `/candidate` |

## Example: Complete Login Flow

```javascript
// 1. Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@recruitkart.com',
    password: 'password123'
  })
});

const data = await response.json();
// Cookie is automatically set by the browser

// 2. Access protected route
const userResponse = await fetch('/api/auth/me');
const userData = await userResponse.json();

// 3. Logout
await fetch('/api/auth/logout', { method: 'POST' });
```
