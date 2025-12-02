# Recruitkart V2

A modern, full-stack recruitment platform built with Next.js 14, featuring role-based dashboards, real-time collaboration, and a transparent fee structure.

## 🚀 Features

### Multi-Role Architecture
- **11 Role-Specific Dashboards** with unique themes and features
- **Platform Admin**: System-wide management and analytics
- **Support**: Ticket management and user assistance
- **Operator**: Platform operations and monitoring
- **Company Admin**: Full hiring pipeline management
- **Company Member**: Task-based collaboration
- **Interviewer**: Interview scheduling and feedback
- **Decision Maker**: Executive approvals and analytics
- **TAS (Talent Acquisition Specialist)**: Candidate bank and submissions
- **Candidate**: Job applications and profile management
- **Financial Controller**: Payouts, invoices, and escrow management
- **Compliance Officer**: Verifications, audits, and reports

### Core Functionality
- 🔐 **JWT-based Authentication** with role-based access control
- 📊 **Real-time Dashboards** with animated stats and charts
- 💼 **Job Management** with infrastructure and success fees
- 👥 **Candidate Pipeline** with submission tracking
- 📅 **Interview Scheduling** with feedback forms
- 💰 **Escrow System** for transparent payments
- 🎫 **Support Ticketing** for dispute resolution

### Technical Highlights
- ⚡ **Next.js 14** with App Router and Server Components
- 🎨 **Tailwind CSS** with custom design system
- 🗄️ **PostgreSQL** with Prisma ORM (multi-file schema)
- 🔄 **Redis** for caching and rate limiting
- 📦 **MinIO** for object storage (S3-compatible)
- 🐳 **Docker Compose** for local development
- 🧪 **Playwright** for E2E testing

## 📁 Project Structure

```
recruitkart_app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin dashboard
│   │   ├── support/           # Support dashboard
│   │   ├── operator/          # Operator dashboard
│   │   ├── tas/               # TAS dashboard
│   │   ├── candidate/         # Candidate dashboard
│   │   ├── dashboard/
│   │   │   ├── company/       # Company Admin dashboard
│   │   │   ├── member/        # Company Member dashboard
│   │   │   ├── interviewer/   # Interviewer dashboard
│   │   │   └── decision-maker/# Decision Maker dashboard
│   │   ├── api/               # API routes
│   │   └── login/             # Authentication
│   ├── lib/                   # Utilities and clients
│   │   ├── prisma.ts         # Prisma client (singleton)
│   │   ├── redis.ts          # Redis client (singleton)
│   │   ├── storage.ts        # MinIO/S3 client
│   │   ├── cache.ts          # Redis cache wrapper
│   │   ├── rate-limit.ts     # Rate limiting utility
│   │   └── auth.ts           # JWT utilities
│   └── components/            # Reusable components
├── prisma/
│   ├── schema/               # Multi-file schema
│   │   ├── base.prisma       # Config
│   │   ├── enums.prisma      # Enums
│   │   ├── users.prisma      # User models
│   │   ├── jobs.prisma       # Job models
│   │   ├── candidates.prisma # Candidate models
│   │   ├── submissions.prisma# Submission models
│   │   └── support.prisma    # Support models
│   └── migrations/           # Database migrations
├── scripts/
│   ├── setup.js              # Automated setup
│   ├── clean.js              # Cleanup script
│   └── seed.ts               # Database seeding
├── docs/                     # Documentation
│   ├── api/                  # API documentation
│   └── architecture/         # Architecture docs
└── docker-compose.yml        # Local services
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching and rate limiting
- **MinIO** - Object storage (S3-compatible)

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Playwright** - E2E testing

## 🚦 Quick Start

### Prerequisites
- Node.js 18+
- Docker Desktop
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recruitkart_app
   ```

2. **Run automated setup**
   ```bash
   npm run setup
   ```
   This will:
   - Install dependencies
   - Start Docker services (PostgreSQL, Redis, MinIO)
   - Run database migrations
   - Seed the database with test users

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000)

### Production Setup

```bash
npm run setup:prod
npm run build
npm start
```

## 👥 Test Users

All users have the password: `password123`

| Role | Email | Dashboard |
|------|-------|-----------|
| Admin | admin@recruitkart.com | `/admin` |
| Support | support@recruitkart.com | `/support` |
| Operator | operator@recruitkart.com | `/operator` |
| Company Admin | hr@acme.com | `/dashboard/company` |
| Company Member | member@acme.com | `/dashboard/member` |
| Interviewer | interviewer@acme.com | `/dashboard/interviewer` |
| Decision Maker | decision@acme.com | `/dashboard/decision-maker` |
| TAS | agency@tas.com | `/tas` |
| Candidate | john@doe.com | `/candidate` |
| Financial Controller | finance@recruitkart.com | `/dashboard/finance` |
| Compliance Officer | compliance@recruitkart.com | `/dashboard/compliance` |

## 📜 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run setup        # Automated development setup
npm run setup:prod   # Automated production setup
npm run clean        # Clean project (Docker + build)
npm run db:seed      # Seed database
npm run db:migrate   # Run migrations
```

## 🗄️ Database Schema

The schema is split into domain-specific files:

- **base.prisma** - Configuration and datasource
- **enums.prisma** - All enum definitions
- **users.prisma** - User, Organization, Invitation, TASProfile
- **jobs.prisma** - Job, EscrowLedger
- **candidates.prisma** - Candidate model
- **submissions.prisma** - Submission, Interview
- **support.prisma** - Ticket model

See [docs/architecture/database.md](docs/architecture/database.md) for details.

## 🔐 Authentication & Authorization

- **JWT-based** authentication with httpOnly cookies
- **Role-based access control** (RBAC)
- **Verification status** tracking
- **Password reset** functionality

See [docs/api/authentication.md](docs/api/authentication.md) for API details.

## 📚 Documentation

- [API Documentation](docs/api/README.md)
- [Architecture Overview](docs/architecture/README.md)
- [Database Schema](docs/architecture/database.md)
- [Role Permissions](docs/architecture/roles.md)

## 🧪 Testing

```bash
# Run E2E tests
npm run test:e2e

# Run specific test
npx playwright test tests/company-job-posting.spec.ts
```

## 🐳 Docker Services

The project uses Docker Compose for local development:

- **PostgreSQL** (port 5432) - Primary database
- **Redis** (port 6379) - Caching and rate limiting
- **MinIO** (port 9000) - Object storage

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies.
