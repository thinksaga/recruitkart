# Recruitkart - Development Scripts

This directory contains the database seeding logic. The primary orchestration logic has been consolidated into the root-level `setup.js` script.

## 🛠️ Main Orchestrator (root/setup.js)

We use a single, cross-platform Node.js script to handle the entire application lifecycle. This works on Windows, macOS, and Linux without requiring bash scripts.[1]

Location: `../setup.js`

| Command | Description |
|---------|-------------|
| `node setup.js` | Development Setup: Starts Docker, installs dependencies, migrates DB, seeds test data, and creates admin accounts. |
| `node setup.js --build` | Production Build: Performs a clean install (`npm ci`), generates the Prisma Client, and builds the Next.js app. |
| `node setup.js --clean` | Deep Clean: Safe-kills processes, removes Docker containers/volumes, and deletes `node_modules` and build artifacts. | [2]

## 📂 Scripts in this Directory

### seed.ts (Database Seeder)

This script populates the database with rich test data simulating a real-world environment. It is automatically called by `setup.js` during initialization but can be run manually to reset data.[3]

**Command:**
```bash
npx tsx scripts/seed.ts
```

**What it generates:**
- Organizations: Acme Corp (Bangalore) & TechFlow (Mumbai).
- TAS Profiles: Verified recruiters with credit balances and reputation scores.
- Jobs: Various states (Open, Filled, Closed) with locked Financial Snapshots.
- Candidates: "No-Resume" profiles with JSON-structured work history and skills.
- Submissions: Simulates the recruitment funnel (Interviewing, Hired, etc.).
- Compliance: Creates support tickets and interview feedback records.

## 🔐 Default Credentials

The setup process automatically creates these accounts.

### 🛡️ Recruitkart Internal Staff (Ops)

| Role | Email | Password |
|------|-------|----------|
| SUPER ADMIN | [admin@recruitkart.com](mailto:admin@recruitkart.com) | `admin@recruitkart2024` |
| SUPPORT | [support@recruitkart.com](mailto:support@recruitkart.com) | `support@recruitkart2024` |
| COMPLIANCE | [operator@recruitkart.com](mailto:operator@recruitkart.com) | `operator@recruitkart2024` | [4]

### 🏢 Company Users (Hiring)

| Company | Role | Email | Password |
|---------|------|-------|----------|
| Acme Corp | Admin | [admin@acme.com](mailto:admin@acme.com) | `password123` |
| Acme Corp | Member | [hiring@acme.com](mailto:hiring@acme.com) | `password123` |
| TechFlow | Admin | [admin@techflow.io](mailto:admin@techflow.io) | `password123` |

### 👥 Talent Acquisition Specialists (TAS)

| Name | Status | Email | Password | Balance |
|------|--------|-------|----------|---------|
| Rahul | Verified | [recruiter1@agency.com](mailto:recruiter1@agency.com) | `password123` | 50 |
| Priya | Verified | [recruiter2@agency.com](mailto:recruiter2@agency.com) | `password123` | 25 |
| Newbie | Pending | [newbie@agency.com](mailto:newbie@agency.com) | `password123` | 0 | [5]

## ⚡ Quick Database Commands

For day-to-day database management without running the full setup:

```bash
# View/Edit data in a GUI
npx prisma studio

# Reset database (Drop all tables & re-seed)
npx prisma migrate reset

# Push schema changes (Prototyping only)
npx prisma db push
```

[1](https://www.markdownguide.org/extended-syntax/)
[2](https://www.codecademy.com/resources/docs/markdown/tables)
[3](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables)
[4](https://learn.microsoft.com/en-us/azure/devops/project/wiki/markdown-guidance?view=azure-devops)
[5](https://docs.codeberg.org/markdown/tables-in-markdown/)
[6](https://about.samarth.ac.in/docs/guides/markdown-syntax-guide)
[7](https://www.geeksforgeeks.org/html/markdown-tables/)
[8](https://www.markdownguide.org/cheat-sheet/)