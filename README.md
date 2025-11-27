# 🚀 Recruitkart – Intelligent Recruiting Platform

**Next-Generation Talent Acquisition System | Multi-Tenant | Role-Based | Production-Ready** [1]

Recruitkart is a modern, full-stack recruitment platform that streamlines the entire hiring lifecycle—from job posting to candidate submission—with a focus on transparency, automation, and collaboration between companies and recruitment agencies (TAS - Talent Acquisition Specialists).

**Built for:**
- 🏢 **Companies** - Post jobs, manage candidates, track submissions
- 👥 **Recruitment Agencies (TAS)** - Find opportunities, submit candidates, earn fees
- 🛡️ **Platform Admins** - Oversee operations, verify users, manage the ecosystem[2]

## 🎯 Core Features

### Multi-Tenant Architecture
- Separate workspaces for companies and recruitment agencies
- Role-based access control (RBAC) with 7 distinct roles
- Secure data isolation and verification workflows

### For Companies
- ✅ Post and manage job openings
- ✅ Review candidate submissions from verified TAS partners
- ✅ Track interview pipelines
- ✅ Manage team members and interviewers
- ✅ Escrow-based fee management

### For Recruitment Agencies (TAS)
- ✅ Browse open job opportunities
- ✅ Submit candidates with consent tracking
- ✅ Credit-based submission system
- ✅ LinkedIn profile integration
- ✅ PAN verification for compliance

### Admin Dashboard
- ✅ User verification and management
- ✅ Organization oversight
- ✅ Platform analytics and statistics
- ✅ Support ticket system
- ✅ Audit logging
- ✅ System settings[3]

## 🏗️ Tech Stack

### Frontend
| Framework | Language | Styling | UI Components | Icons | Forms | State |
|-----------|----------|---------|---------------|-------|-------|-------|
| Next.js 16 (App Router) | TypeScript 5 | TailwindCSS 4 | Custom + Framer Motion | Lucide React | React Hook Form + Zod | React hooks | [4]

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Database**: PostgreSQL 17 (via Prisma ORM)
- **Caching**: Redis 7.4
- **Storage**: MinIO (S3-compatible)
- **Authentication**: JWT (jose library)
- **Password Hashing**: bcryptjs

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database ORM**: Prisma 6.19
- **Testing**: Playwright
- **Linting**: ESLint 9[5]

## 📁 Project Structure

```
recruitkart/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx             # Landing page
│   │   ├── login/               # Authentication pages
│   │   ├── admin/               # Admin dashboard
│   │   │   ├── layout.tsx       # Admin layout with sidebar
│   │   │   ├── users/           # User management
│   │   │   ├── analytics/       # Platform insights
│   │   └── api/                 # API routes
│   ├── components/              # Reusable components
│   └── lib/                     # Utilities
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/
├── scripts/
│   ├── setup.js                # Unified setup & build manager
│   └── seed.ts                 # Database seeding
├── docker-compose.yml
├── .env
└── package.json
```

## 🗄️ Database Schema

### Core Models
| Model | Key Features |
|-------|--------------|
| **User** | Multi-role support, Email auth, Verification tracking |
| **Organization** | Company profiles with GSTIN, Multi-user teams |
| **TASProfile** | PAN verification, Credit balance system |
| **Job** | Salary ranges, Status workflow, Fee tracking |
| **Candidate** | Structured work history, Skills indexing |
| **Submission** | Job-candidate mapping, Status tracking |
| **Interview** | Multi-round support, Feedback tracking |
| **Ticket** | Support request system |
| **EscrowLedger** | Fee escrow management [6] |

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Git

### Quick Start
```bash
git clone <repository-url>
cd recruitkart
node scripts/setup.js
npm run dev
```
Open: **http://localhost:3000**[7]

## 📝 Environment Variables

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/recruitkart?schema=public"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Redis
REDIS_URL="redis://localhost:6379"

# MinIO
AWS_ENDPOINT="http://localhost:9000"
AWS_ACCESS_KEY_ID="minioadmin"
AWS_SECRET_ACCESS_KEY="minioadmin"
```

## 🐳 Docker Services

| Service | Port | Purpose |
|---------|------|---------|
| PostgreSQL | 5432 | Primary database |
| Redis | 6379 | Caching & sessions |
| MinIO | 9000, 9001 | Object storage |
**MinIO Console**: http://localhost:9001 (minioadmin/minioadmin)[8]

## 👥 Default Credentials

### Recruitkart Staff
| Role | Email | Password |
|------|-------|----------|
| SUPER_ADMIN | [admin@recruitkart.com](mailto:admin@recruitkart.com) | `admin@recruitkart2024` |
| SUPPORT_AGENT | [support@recruitkart.com](mailto:support@recruitkart.com) | `support@recruitkart2024` |

### Test Users
| User Type | Email | Password |
|-----------|-------|----------|
| Company Admin | [admin@acme.com](mailto:admin@acme.com) | `password123` |
| TAS (Verified) | [recruiter1@agency.com](mailto:recruiter1@agency.com) | `password123` | 

## 📜 Available Scripts

```bash
# Setup
node scripts/setup.js          # Development Setup
node scripts/setup.js --build  # Production Build
node scripts/setup.js --clean  # Deep Clean

# Database
npm run db:migrate
npm run db:studio
```

## 🛣️ Roadmap

- **Phase 1: Core Platform** ✅
- **Phase 2: Job & Candidate Management** 🚧
- **Phase 3: AI Integration** 📋
- **Phase 4: Advanced Features** 📋 

**Built with ❤️ by the Thinksaga Team** | **Support**: [support@recruitkart.com](mailto:support@recruitkart.com)

[1](https://www.markdownguide.org/extended-syntax/)
[2](https://www.codecademy.com/resources/docs/markdown/tables)
[3](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables)
[4](https://learn.microsoft.com/en-us/azure/devops/project/wiki/markdown-guidance?view=azure-devops)
[5](https://docs.codeberg.org/markdown/tables-in-markdown/)
[6](https://about.samarth.ac.in/docs/guides/markdown-syntax-guide)
[7](https://www.geeksforgeeks.org/html/markdown-tables/)
[8](https://www.markdownguide.org/cheat-sheet/)