# 🚀 **Recruitkart – Intelligent Recruiting OS**

### *AI-Native Talent Acquisition Platform | Cloud-Agnostic | Modular | Fully Automated*

Recruitkart is a next-generation, AI-native Talent Acquisition System (TAS) that automates the entire recruitment lifecycle — from job intake to offer rollout — using domain-specific workflows, multi-agent orchestration, deep candidate analytics, and seamless ATS/HRIS integrations.

Recruitkart is built to serve:

* **Recruitment Agencies**
* **HR Consulting Firms**
* **Corporate Talent Acquisition Teams**
* **High-volume hiring companies**
* **Startups building their hiring engine**

Recruitkart is designed to be **modular**, **cloud-agnostic**, **API-first**, and fully powered by **AI Assistants** that collaborate across workflows.

---

# 🧠 **Core Philosophy**

### 1. **AI-first, Human-supervised**

Every workflow is driven by AI agents (JD Agent, Sourcing Agent, Screening Agent, Coordination Agent, Analytics Agent).
Humans supervise, override, and tune.

### 2. **Cloud-agnostic**

Runs on **AWS / GCP / Azure / DigitalOcean / Bare-metal**.
All components packaged to run via containers.

### 3. **Open-source friendly**

Backend uses **Express + Postgres + Redis + Elastic + MinIO** (all open-source compatible).

### 4. **Enterprise-grade**

Audit logs, RBAC, rate limiting, encryption, observability, SLA-friendly operations.

---

# 🏗️ **High Level Features**

### ✔️ AI-Powered Job Intake

* Convert hiring manager conversations → structured JD
* Extract skills, seniority, compensation, location
* Generate role scorecards
* Auto-calculated job difficulty index

### ✔️ AI Candidate Sourcing

* LinkedIn parsing (manual + API)
* Job board integrations
* Resume ingestion (PDF/Docx)
* AI-based match score
* Smart shortlisting

### ✔️ AI Screening Workflows

* Automated screening calls (LLM voice agent)
* Skill assessment
* AI summarization & candidate reports
* Auto-updated ATS cards

### ✔️ Interview Management

* Scheduler with Google/Outlook
* Zoom / Meet integration
* AI-generated interview feedback
* Panel coordination

### ✔️ CRM + ATS

* Pipeline boards
* Candidate lifecycle automation
* Requirements management
* Client portal

### ✔️ Analytics

* Time-to-fill
* Pipeline bottleneck
* Recruiter performance
* Client SLA dashboards

---

# 🏛️ **System Architecture Overview**

Recruitkart follows a **modular microservices-based** architecture.

### **1. Frontend**

* **Next.js 15 / App Router**
* Shadcn UI + Tailwind
* AI Assistants integrated via API
* SSR for SEO pages
* Client dashboards fully reactive

### **2. Backend (Core API Layer)**

* **Node.js + Express**
* Modular service-based architecture
* REST + Webhooks + Async Jobs
* Multi-tenant architecture
* AI agent gateway

### **3. Database & Storage**

* **PostgreSQL** – primary OLTP
* **Redis** – caching, queues
* **ElasticSearch / Meilisearch** – search
* **MinIO** – file storage (resumes, docs)

### **4. AI Layer**

* Agent orchestrator
* Prompt manager
* Vector DB (pgvector / Qdrant)
* Reranker + Embedding pipeline
* AI Workflow executor

### **5. Integrations Layer**

* LinkedIn
* Google Calendar
* Outlook
* Zoom
* Slack / Teams
* Email gateway

### **6. Infra & Deployment**

* Kubernetes / Docker
* GitHub Actions
* Terraform (optional)
* OpenTelemetry + Grafana
* Horizontal scaling

---

# 🧩 **Monorepo Structure**

```
recruitkart/
│
├── apps/
│   ├── backend/            # Express API
│   ├── frontend/           # Next.js Web UI
│   └── ai/                 # AI agents & Orchestrator
│
├── infra/
│   ├── docker/
│   ├── k8s/
│   └── terraform/
│
├── libs/
│   ├── ui/                 # Shared UI components
│   ├── utils/              # Shared utilities
│   ├── types/              # Shared TS types
│   └── prompts/            # Reusable prompt packs
│
├── docs/
│   ├── Architecture.md
│   ├── API-Reference.md
│   ├── Database-Schema.md
│   ├── Prompt-System.md
│   └── DevOps-Guide.md
│
└── README.md
```

---

# ⚙️ **Tech Stack**

### **Frontend**

* Next.js
* TailwindCSS
* Shadcn/UI
* Zustand / React Query
* Framer motion

### **Backend**

* Node.js + Express
* PostgreSQL
* Redis
* Elasticsearch
* MinIO
* BullMQ
* JWT / OAuth

### **AI**

* LLMs (OpenAI / Anthropic / Local LLMs)
* pgvector / Qdrant
* Multi-agent system

### **DevOps**

* Docker
* Kubernetes
* GitHub Actions
* Grafana + Loki + Tempo
* Nginx / Traefik

---

# 🤖 **AI Agents in Recruitkart**

| Agent                  | Purpose                                                |
| ---------------------- | ------------------------------------------------------ |
| **JD Agent**           | Converts intake notes → JD & scorecards                |
| **Sourcing Agent**     | Finds candidates, parses resumes, computes match score |
| **Screening Agent**    | Executes calls, summaries, verifies skills             |
| **Coordination Agent** | Schedules interviews, handles follow-ups               |
| **Client Ops Agent**   | Generates reports, updates client dashboards           |
| **Analytics Agent**    | Pipeline insights & performance metrics                |

Each agent operates via a **workflow engine**:

* Event-driven
* Retry safe
* Observability built-in

---

# 🔌 **API Overview**

### `/auth/*`

Signup, login, SSO, multi-tenant onboarding.

### `/jobs/*`

Job creation, JD parsing, requirements, role scorecard.

### `/candidates/*`

Uploading CVs, parsing, match scoring, tagging.

### `/workflow/*`

Triggering AI agents.

### `/communications/*`

Email, SMS, WhatsApp, notifications.

### `/analytics/*`

Dashboards, metrics & reports.

Full OpenAPI spec available in:
`docs/API-Reference.md`

---

# 🧪 **Testing Strategy**

* Unit tests (Jest)
* Integration tests
* Workflow simulation tests
* Mocked LLM responses
* API load testing with k6
* Contract tests for integrations

---

# 🔐 **Security & Compliance**

* RBAC
* JWT Rotations
* Multi-tenant isolation
* Field-level encryption for PII
* Secure file uploads
* Audit logs
* GDPR-friendly architecture

---

# 🚀 Deployment

Local setup:

```
docker-compose up --build
```

Production:

* Push to `main` triggers CI/CD pipeline
* Builds Docker images
* Deploys via Helm to Kubernetes
* Auto-migrations + seed
* Monitoring + logs enabled

---

# 👩‍💻 **How to Contribute**

1. Fork repo
2. Create feature branch
3. Open PR with detailed description
4. Ensure lint + tests pass
5. One approval required to merge

---

# 📄 License

MIT / Custom Enterprise License (choose one later)

---

# 🎯 Summary

Recruitkart is a full-stack, AI-native recruitment OS designed to automate and optimize hiring from end-to-end, built with:

* **Enterprise architecture**
* **Cloud-agnostic deployment**
* **Modern frontend**
* **Modular backend**
* **Deep AI-powered workflows**
* **Open-source compatibility**

---

If you want, I can generate:

✅ README for **backend only**
✅ README for **frontend only**
✅ README for **AI agent system**
✅ Architecture diagram
✅ API reference
✅ DB schema
✅ Contribution guidelines

Just tell me!
