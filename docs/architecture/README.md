# Architecture Overview

## System Architecture

Recruitkart is built as a modern, full-stack web application using Next.js 14 with a focus on scalability, maintainability, and developer experience.

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │   Mobile     │  │   Desktop    │      │
│  │   (React)    │  │   (Future)   │  │   (Future)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Next.js 14 App Router                   │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │   │
│  │  │   Pages    │  │  API Routes│  │ Middleware │    │   │
│  │  │ (RSC/SSR)  │  │ (Serverless│  │   (Auth)   │    │   │
│  │  └────────────┘  └────────────┘  └────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Auth Logic  │  │  Job Logic   │  │ Submission   │      │
│  │   (JWT)      │  │  (CRUD)      │  │   Logic      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │    Redis     │  │    MinIO     │      │
│  │  (Prisma)    │  │  (Cache)     │  │  (Storage)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Static typing for reliability
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **React Hook Form + Zod**: Form handling and validation

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Prisma ORM**: Type-safe database access
- **JWT**: Stateless authentication
- **bcrypt**: Password hashing

### Infrastructure
- **PostgreSQL**: Primary relational database
- **Redis**: Caching and rate limiting
- **MinIO**: S3-compatible object storage
- **Docker**: Containerization

## Design Patterns

### 1. Singleton Pattern
Used for database and cache clients to prevent connection pool exhaustion:

```typescript
// lib/prisma.ts
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
export default prisma;
```

### 2. Repository Pattern
Abstraction layer for data access:

```typescript
// lib/repositories/userRepository.ts
export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
}
```

### 3. Middleware Pattern
Request/response processing pipeline:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Auth check, rate limiting, etc.
}
```

### 4. Factory Pattern
Creating complex objects:

```typescript
// lib/factories/userFactory.ts
export function createUser(data: UserInput) {
  return {
    ...data,
    password_hash: await bcrypt.hash(data.password, 10),
    created_at: new Date()
  };
}
```

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes group
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   └── dashboard/         # Role dashboards
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── auth/             # Auth components
│   └── dashboard/        # Dashboard components
├── lib/                   # Utilities and clients
│   ├── prisma.ts         # Database client
│   ├── redis.ts          # Cache client
│   ├── auth.ts           # Auth utilities
│   └── utils.ts          # Helper functions
└── types/                 # TypeScript types
```

## Data Flow

### 1. User Authentication
```
User → Login Page → API Route → Prisma → PostgreSQL
                       ↓
                   JWT Token
                       ↓
                  httpOnly Cookie
                       ↓
                  Client Redirect
```

### 2. Protected Resource Access
```
User → Protected Page → Middleware → Verify JWT
                                        ↓
                                   Check Role
                                        ↓
                                  Allow/Deny
```

### 3. Caching Strategy
```
Request → Check Redis → Cache Hit? → Return Cached Data
                           ↓ No
                      Query Database
                           ↓
                      Cache Result
                           ↓
                      Return Data
```

## Security Architecture

### Authentication
- JWT tokens with 24-hour expiry
- httpOnly cookies (XSS protection)
- Secure flag in production (HTTPS only)
- SameSite=Strict (CSRF protection)

### Authorization
- Role-based access control (RBAC)
- Middleware-level route protection
- API-level permission checks

### Data Protection
- Password hashing with bcrypt (10 rounds)
- SQL injection prevention (Prisma)
- XSS prevention (React escaping)
- CSRF protection (SameSite cookies)

### Rate Limiting
- Redis-based sliding window
- Per-IP and per-user limits
- Configurable thresholds

## Scalability Considerations

### Horizontal Scaling
- Stateless API design (JWT)
- Session-less architecture
- Docker containerization

### Caching Strategy
- Redis for frequently accessed data
- Cache invalidation patterns
- TTL-based expiry

### Database Optimization
- Indexed queries
- Connection pooling
- Query optimization

### Asset Optimization
- MinIO for file storage
- CDN-ready architecture
- Image optimization

## Monitoring & Observability

### Logging
- Structured logging
- Error tracking
- Audit trails

### Metrics
- API response times
- Database query performance
- Cache hit rates

### Health Checks
- Database connectivity
- Redis connectivity
- MinIO connectivity

## Deployment Architecture

### Development
```
Local Machine
├── Next.js Dev Server (port 3000)
├── Docker Compose
│   ├── PostgreSQL (port 5432)
│   ├── Redis (port 6379)
│   └── MinIO (port 9000)
```

### Production (Recommended)
```
Cloud Provider
├── Next.js (Vercel/AWS/GCP)
├── PostgreSQL (Managed Service)
├── Redis (Managed Service)
└── S3/MinIO (Object Storage)
```

## Future Enhancements

- [ ] WebSocket for real-time updates
- [ ] GraphQL API layer
- [ ] Microservices architecture
- [ ] Event-driven architecture
- [ ] Message queue (RabbitMQ/Kafka)
- [ ] Elasticsearch for search
- [ ] Kubernetes orchestration
