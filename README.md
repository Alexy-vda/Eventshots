# 📸 EventShot

> **POC - Event Photo Sharing Platform**

A modern Next.js application for creating photo galleries for your events and easily sharing them with your guests.

⚠️ **Project Status**: Proof of Concept / Technical Demonstration. Not intended for production use as-is.

---

## ✨ Features

### 🎯 Core Features

- **Event Management**: Create and organize your events
- **Optimized Upload**: Photo upload with real-time preview
- **Masonry Gallery**: Portfolio-style display with natural aspect ratios
- **ZIP Download**: Export all photos from an event
- **Public Sharing**: Shareable links for access without account

### 🔐 Authentication

- JWT system with refresh tokens
- Secure sessions (10min access token, 7-day refresh token)
- Protected API routes and dashboard pages

### 🖼️ Image Optimization

- Automatic compression with Sharp
- Blur placeholder generation
- Smart resizing (max 2000px)
- Storage on Cloudflare R2

### 🎨 Design

- Minimalist and modern interface
- Responsive masonry layout (Pinterest-style)
- Lightbox carousel for navigation
- Smooth animations and micro-interactions

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** (App Router, RSC, API Routes)
- **React 19** (Client & Server Components)
- **TypeScript** (Strict mode)
- **Tailwind CSS** (Utility-first)

### Backend

- **Next.js API Routes** (Serverless)
- **Prisma ORM** (SQLite for POC)
- **JWT** (Authentication)
- **Bcrypt** (Password hashing)

### Storage & Assets

- **Cloudflare R2** (Object storage - S3 compatible)
- **Sharp** (Image processing)
- **JSZip** (Archive generation)

### Security

- Rate limiting (5 req/min auth, 20 req/min API)
- Zod validation on all endpoints
- Path traversal protection (triple validation)
- Secrets via Authorization headers

---

## 🚀 Installation

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Docker & Docker Compose (for PostgreSQL)
- Cloudflare R2 account (free up to 10 GB)

### 1. Clone the project

```bash
git clone https://github.com/Alexy-vda/eventshot.git
cd eventshot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configuration

Create a `.env.local` file at the root:

```env
# PostgreSQL (local via Docker)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/eventshot"

# JWT Secrets (generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-here
REFRESH_TOKEN_SECRET=your-super-secret-refresh-key-here

# Cloudflare R2
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://pub-xxxxxxxxx.r2.dev

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Start PostgreSQL

```bash
# Start PostgreSQL container
docker-compose up -d

# Verify it's running
docker ps
```

### 5. Initialize database

```bash
npx prisma generate
npx prisma db push
```

### 6. Start development server

```bash
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

``` bash
eventshot/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── auth/            # Authentication
│   │   ├── events/          # Events CRUD
│   │   ├── photos/          # Photos management
│   │   ├── upload/          # R2 upload handler
│   │   └── proxy-image/     # Image proxy
│   ├── dashboard/           # Protected area
│   ├── events/[slug]/       # Public gallery
│   └── page.tsx             # Landing page
│
├── components/              # React components
│   ├── auth/               # Login/Register forms
│   ├── layout/             # Navigation components
│   └── ui/                 # Reusable UI elements
│
├── lib/                    # Core logic
│   ├── auth.ts            # JWT helpers
│   ├── db.ts              # Prisma client
│   ├── r2.ts              # Cloudflare R2 operations
│   ├── imageOptimizer.ts  # Sharp processing
│   ├── downloads.ts       # ZIP generation
│   └── rateLimit.ts       # Rate limiting
│
├── prisma/
│   └── schema.prisma      # Database schema
│
└── types/
    └── index.ts           # TypeScript types
```

---

## 🔧 Cloudflare R2 Configuration

### 1. Create a bucket

```bash
# Via Cloudflare Dashboard
Workers & Pages → R2 → Create Bucket → "eventshoots"
```

### 2. Generate API keys

```bash
# R2 → Manage R2 API Tokens → Create API Token
# Permissions: Object Read & Write
```

### 3. Configure public domain

```bash
# Bucket Settings → Public Access → Allow
# Get public URL: https://pub-xxxxxxxxx.r2.dev
```

---

## 📸 Usage

### 1. Create an account

``` bash
http://localhost:3000/register
```

### 2. Create an event

``` bash
http://localhost:3000/dashboard
```

``` bash
Dashboard → Create Event
```

### 3. Upload photos

```bash
Event → Upload → Select up to 50 images
```

### 4. Share

```bash
Copy the event public link
Guests can view and download without an account
```

---

## 🔐 Security

### Fixed Vulnerabilities

- ✅ **Path traversal** in `deleteFromR2` (triple validation)
- ✅ **Secret exposure** in `/api/revalidate` (Authorization header)
- ✅ **Rate limiting** on auth and public APIs
- ✅ **Input validation** with Zod on all endpoints

### Implemented Best Practices

- JWT rotation (access + refresh tokens)
- Bcrypt with 10 rounds
- Secure headers (Authorization, no query params)
- R2 folder whitelist

---

## 🚀 Deployment

### Vercel (Recommended)

**1. Create Vercel Postgres Database**

```bash
# Install Vercel CLI
npm i -g vercel

# Login and link project
vercel login
vercel link

# Via Vercel Dashboard:
# Your Project → Storage → Create Database → Postgres
# This auto-configures DATABASE_URL
```

**2. Configure Environment Variables**

In Vercel Dashboard → Settings → Environment Variables:

```env
# Auto-configured by Vercel Postgres:
# ✅ DATABASE_URL (already set)

# Add manually:
JWT_SECRET=your-super-secret-jwt-key
REFRESH_TOKEN_SECRET=your-super-secret-refresh-key
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
R2_PUBLIC_URL=...
NEXT_PUBLIC_BASE_URL=$VERCEL_URL
```

**3. Push Database Schema**

```bash
npx prisma db push
```

**4. Deploy**

```bash
vercel --prod
```

---

### Local Production Build

```bash
npm run build
npm start
```

---

### Docker (VPS Deployment)

```dockerfile
# Dockerfile already configured
docker build -t eventshot .
docker run -p 3000:3000 --env-file .env.local eventshot
```

---

## ⚠️ Known Limitations

### Technical

- **PostgreSQL required**: Use Vercel Postgres, Supabase, or Neon for deployment
- **No testing**: No automated tests (manual only)
- **No monitoring**: No centralized logging
- **Single region**: R2 bucket not replicated

### Functional

- No modification after upload
- 50 photos/upload limit (arbitrary)
- No nested album management
- Synchronous ZIP download (can timeout on large events)

---

## 📊 Performance

### Applied Optimizations

- ISR with 60s revalidation (public event pages)
- Image optimization (Next.js Image + Sharp)
- Lazy image loading with blur placeholders
- Fire & forget for async optimization

---

## 🐛 Known Issues

### Non-blocking Issues

- [ ] Carousel can scroll outside viewport on small screens
- [ ] ZIP download can timeout on +100 photos
- [ ] No feedback if R2 upload partially fails

### Workarounds

- Limit to 50 photos/event for demo
- Use Chrome/Safari (better modern image support)

---

## 📝 Technical Notes

### Architecture Choices

**Why Next.js App Router?**

- RSC (React Server Components) for optimal performance
- API Routes for backend logic
- Built-in image optimization
- Metadata API for SEO

**Why Cloudflare R2?**

- S3 compatible API (easy migration)
- No egress fees (free bandwidth)
- Edge network performance
- 10 GB free/month

**Why PostgreSQL?**

- Production-ready (Vercel, Supabase, Neon support)
- ACID compliant
- Better for multi-user scenarios
- Easy to scale

---

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Guide](https://www.prisma.io/docs)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Sharp Image Processing](https://sharp.pixelplumbing.com/)

---

## 🎓 Context

Project created as a POC to explore:

- Next.js 16 App Router (RSC + API Routes)
- On-the-fly image optimization with Sharp
- Object storage (R2) with Next.js
- JWT authentication patterns
- Modern React 19 patterns
- Test for a side activity tool as a photographer

---

<div align="center">
  
**⚠️ POC - Not intended for production ⚠️**

Made with ❤️

</div>
