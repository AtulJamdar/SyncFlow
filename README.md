# SyncFlow - Project Management SaaS

SyncFlow is a multi-tenant, role-based SaaS platform for managing clients, projects, and invoices, designed for small to medium-sized agencies and freelancers.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, TanStack Query, Zustand, Recharts
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (Access + Refresh Tokens in HTTP-only cookies)
- **Real-Time**: Server-Sent Events (SSE)

---

## Getting Started

### 1. Prerequisites

- Node.js (v18 or later)
- MongoDB (A local instance or a cloud-based one like MongoDB Atlas)
- npm (v9 or later)

### 2. Installation

Clone the repository and install all dependencies using the root `install:all` script.

```bash
git clone <your-repo-url>
cd syncflow
npm run install:all