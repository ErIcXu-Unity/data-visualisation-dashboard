# AIBUILD Analytics - Data Visualization Dashboard

A comprehensive web-based system for analyzing procurement, sales, and inventory history for retail management. Built with modern technologies to provide real-time insights and intelligent data analysis.

## Live Demo

**Production URL:** https://data-visualisation-dashboard-ten.vercel.app/

## Tech Stack

### Frontend

- **Next.js 15.5.6** - React framework with App Router architecture
- **React 19.1.0** - UI component library
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling framework
- **Recharts 3.3.0** - Data visualization library
- **React Markdown 9.0.1** - Markdown rendering for AI insights

### Backend

- **Next.js API Routes** - RESTful API endpoints
- **NextAuth.js 5.0.0** - Authentication system with JWT strategy
- **Prisma ORM 6.17.1** - Database toolkit and query builder
- **PostgreSQL** - Relational database (hosted on Neon)
- **bcryptjs 3.0.2** - Password hashing

### AI Integration

- **OpenAI API 4.77.3** - GPT-powered business insights generation

### Data Processing

- **XLSX 0.18.5** - Excel/CSV file parsing and processing

### Development Tools

- **ESLint 9** - Code linting
- **tsx 4.20.6** - TypeScript execution for scripts
- **Turbopack** - Next.js bundler for faster builds

## Core Features

### 1. User Authentication

- Secure registration with email and password
- Password hashing using bcrypt
- JWT-based session management
- Protected routes with middleware
- Session persistence across page reloads

### 2. Data Import System

- Excel/CSV file upload capability
- Automatic parsing of product data
- Batch processing with transaction support
- Data validation and error handling
- Support for multiple products in single upload
- Upsert functionality to update existing products

### 3. Interactive Data Visualization

- Multi-line charts showing:
  - Inventory levels over time
  - Procurement amounts (quantity × price)
  - Sales amounts (quantity × price)
- Multi-product comparison on single chart
- Product selector with search functionality
- Dynamic chart updates based on selection
- Responsive design for all screen sizes

### 4. AI-Powered Business Insights

- OpenAI GPT integration for intelligent analysis
- Automated insights on:
  - Sales trends and patterns
  - Inventory management recommendations
  - Procurement optimization suggestions
  - Anomaly detection
- Natural language explanations
- Markdown-formatted reports

### 5. Dashboard Management

- Real-time product data display
- Historical data tracking across multiple days
- User-specific data isolation
- Cascading delete for data integrity

## API Endpoints

### Authentication APIs

#### POST /api/auth/register

Register a new user account.

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Validation:**

- Name: Required, non-empty
- Email: Required, valid email format
- Password: Required, minimum 6 characters

**Response:**

```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

#### POST /api/auth/[...nextauth]

NextAuth.js authentication endpoints for login/logout.

**Credentials Login:**

- Email and password validation
- Database user lookup
- Password verification with bcrypt
- JWT token generation

#### POST /api/auth/reset-password

Password reset functionality (placeholder for future implementation).

### Product APIs

#### GET /api/products

Retrieve all products for authenticated user.

**Authentication:** Required (JWT)

**Response:**

```json
[
  {
    "id": "string",
    "name": "string",
    "openingInventory": "number"
  }
]
```

#### GET /api/products/[id]

Retrieve detailed product data including daily records.

**Authentication:** Required (JWT)

**Response:**

```json
{
  "id": "string",
  "name": "string",
  "openingInventory": "number",
  "history": [
    {
      "day": "number",
      "inventory": "number",
      "procurementAmount": "number",
      "salesAmount": "number",
      "procurementQty": "number",
      "procurementPrice": "number",
      "salesQty": "number",
      "salesPrice": "number"
    }
  ]
}
```

#### POST /api/upload

Upload and process Excel/CSV files containing product data.

**Authentication:** Required (JWT)

**Request:** multipart/form-data with file

**Expected CSV Format:**

```
Product ID,Product Name,Opening Inventory,Day 1 Procurement Qty,Day 1 Procurement Price,Day 1 Sales Qty,Day 1 Sales Price,...
```

**Processing:**

- Parse Excel/CSV file
- Calculate inventory for each day
- Upsert products and daily records
- Transaction-based for data consistency

**Response:**

```json
{
  "success": true,
  "productsCount": "number"
}
```

### AI APIs

#### POST /api/ai/insights

Generate AI-powered business insights from product data.

**Authentication:** Required

**Request Body:**

```json
{
  "productData": {
    "id": "string",
    "name": "string",
    "openingInventory": "number",
    "history": [...]
  }
}
```

**Response:**

```json
{
  "insights": "Markdown-formatted AI analysis"
}
```

## User Flow

### New User Journey

1. Land on homepage
2. Click "Create Account"
3. Fill registration form with validation
4. Automatic redirect to login page
5. Login with credentials
6. Redirect to dashboard

### Returning User Journey

1. Access login page
2. Enter credentials
3. JWT token generated and stored
4. Redirect to dashboard
5. Session persists until logout

### Data Upload Flow

1. User navigates to dashboard
2. Click upload button
3. Select Excel/CSV file
4. File parsed on backend
5. Data validated and processed
6. Products stored in database
7. Success notification displayed
8. Product list updated

### Data Visualization Flow

1. User views dashboard
2. Product selector displays all user products
3. User selects one or more products
4. Chart fetches product details via API
5. Multi-line chart renders with:
   - Inventory trend line
   - Procurement amount line
   - Sales amount line
6. User can request AI insights
7. GPT analyzes data and returns recommendations
8. Insights displayed in readable format

### Authentication Flow

1. User submits login form
2. Middleware checks if user is authenticated
3. If not authenticated:
   - Redirect to login page
4. If authenticated:
   - Allow access to protected routes
5. JWT token stored in secure HTTP-only cookie
6. Token verified on each request
7. Logout clears session and redirects to home

## Project Structure

```
data-visualisation-dashboard/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   ├── migrations/            # Database migrations
│   └── seed.ts                # Seed script for demo data
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/  # NextAuth handlers
│   │   │   │   ├── register/       # User registration
│   │   │   │   └── reset-password/ # Password reset
│   │   │   ├── products/
│   │   │   │   ├── [id]/          # Get product by ID
│   │   │   │   └── route.ts       # Get all products
│   │   │   ├── upload/
│   │   │   │   └── route.ts       # File upload handler
│   │   │   └── ai/
│   │   │       └── insights/      # AI insights generation
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Main dashboard page
│   │   ├── login/
│   │   │   └── page.tsx           # Login page
│   │   ├── register/
│   │   │   └── page.tsx           # Registration page
│   │   ├── reset-password/
│   │   │   └── page.tsx           # Password reset page
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Homepage
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── ChartDisplay.tsx       # Data visualization component
│   │   ├── ExcelUpload.tsx        # File upload component
│   │   ├── ProductSelector.tsx    # Product selection UI
│   │   └── SessionProvider.tsx    # Auth session wrapper
│   ├── lib/
│   │   ├── auth.ts                # NextAuth configuration (full)
│   │   ├── auth-config.ts         # Auth config (lightweight for middleware)
│   │   └── prisma.ts              # Prisma client singleton
│   ├── types/
│   │   ├── next-auth.d.ts         # NextAuth type extensions
│   │   └── product.ts             # Product type definitions
│   └── middleware.ts              # Route protection middleware
├── .env                           # Environment variables
├── next.config.ts                 # Next.js configuration
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript configuration
└── tailwind.config.ts             # Tailwind configuration
```

## Data Model

### User

```prisma
model User {
  id        String    @id @default(cuid())
  name      String
  email     String    @unique
  password  String
  products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

**Purpose:** Store user account information with encrypted passwords.

**Relationships:** One-to-many with Product (cascade delete).

### Product

```prisma
model Product {
  internalId       String        @id @default(cuid())
  id               String
  name             String
  openingInventory Int
  dailyRecords     DailyRecord[]
  user             User          @relation(fields: [userId], references: [id])
  userId           String

  @@unique([userId, id])
}
```

**Purpose:** Store product information including opening inventory levels.

**Key Features:**

- Internal CUID for database primary key
- Custom product ID for business logic
- Composite unique constraint on userId + id
- Supports upsert operations

**Relationships:**

- Many-to-one with User
- One-to-many with DailyRecord (cascade delete)

### DailyRecord

```prisma
model DailyRecord {
  id               Int     @id @default(autoincrement())
  day              Int
  procurementQty   Int
  procurementPrice Float
  salesQty         Int
  salesPrice       Float
  inventory        Int
  product          Product @relation(fields: [productId], references: [internalId])
  productId        String

  @@unique([productId, day])
}
```

**Purpose:** Track daily procurement, sales, and inventory data.

**Key Features:**

- Stores both quantity and price for amounts calculation
- Unique constraint on productId + day prevents duplicates
- Inventory calculated as: previous inventory + procurement - sales

**Relationships:** Many-to-one with Product

## Key Technical Decisions

### 1. Authentication Architecture

- **Separation of Auth Configs:** Split auth configuration into two files to reduce middleware bundle size:
  - `auth-config.ts`: Lightweight config for Edge Runtime middleware (no bcrypt/prisma imports)
  - `auth.ts`: Full config with database access for API routes
- **Why:** Vercel Edge Functions have 1MB size limit. Bcrypt and Prisma are large dependencies that would exceed this limit if included in middleware.

### 2. Database Design

- **Composite Unique Key:** Using `[userId, id]` allows multiple users to have products with same ID
- **Cascade Deletes:** Ensures data integrity when users or products are deleted
- **Calculated Inventory:** Daily inventory is pre-calculated and stored rather than computed on-demand for performance

### 3. Transaction Management

- **Increased Timeout:** Prisma transactions configured with `maxWait: 10000ms` and `timeout: 15000ms` to handle large file uploads
- **Batch Processing:** All products in upload processed in single transaction for atomicity

### 4. Dynamic Imports

- **Lazy Loading Prisma:** In auth.ts, Prisma is dynamically imported in authorize function to prevent bundling in middleware
- **Why:** Keeps middleware bundle small while maintaining full functionality in API routes

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
AUTH_SECRET="your-secret-key-here"

# Optional: AI Features
OPENAI_API_KEY="sk-..."
```

**Required Variables:**

- `DATABASE_URL`: PostgreSQL connection string (Neon recommended)
- `AUTH_SECRET`: Random string for JWT signing (generate with `openssl rand -base64 32`)

**Optional Variables:**

- `OPENAI_API_KEY`: Required only if using AI insights feature

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- PostgreSQL database (local or Neon)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd data-visualisation-dashboard
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your database URL and auth secret
```

4. Generate Prisma Client

```bash
npx prisma generate
```

5. Run database migrations

```bash
npx prisma migrate deploy
```

6. (Optional) Seed demo data

```bash
npx prisma db seed
```

This creates a demo user:

- Email: demo@example.com
- Password: demo123

7. Start development server

```bash
npm run dev
```

8. Open http://localhost:3000

### Building for Production

```bash
npm run build
npm start
```

## Deployment on Vercel

### Prerequisites

- Vercel account
- GitHub repository connected to Vercel

### Steps

1. Push code to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Import project in Vercel dashboard

3. Configure environment variables in Vercel:

   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `OPENAI_API_KEY` (optional)

4. Deploy
   - Vercel automatically deploys on push to main branch
   - Build command: `npm run build`
   - Output directory: `.next`

### Database Setup for Production

1. Create PostgreSQL database on Neon (https://neon.tech)
2. Copy connection string
3. Add to Vercel environment variables
4. Run migrations:

```bash
npx prisma migrate deploy
```

### Important Notes

- Middleware bundle must stay under 1MB (Edge Runtime limit)
- Serverless functions have 10s timeout on Hobby plan (can increase with Pro)
- Database connection pooling recommended for production

## Performance Optimizations

1. **Edge Middleware:** Authentication checks run on Edge Runtime for minimal latency
2. **Prisma Connection Pooling:** Singleton pattern prevents connection exhaustion
3. **Transaction Batching:** Multiple database operations combined in transactions
4. **Dynamic Imports:** Large dependencies loaded only when needed
5. **Turbopack:** Faster builds and hot module replacement

## Security Features

1. **Password Hashing:** Bcrypt with 10 salt rounds
2. **JWT Tokens:** Secure, HTTP-only cookies
3. **Route Protection:** Middleware validates authentication on all protected routes
4. **SQL Injection Prevention:** Prisma ORM parameterizes all queries
5. **XSS Protection:** Next.js automatically escapes rendered content
6. **CSRF Protection:** NextAuth.js built-in CSRF tokens

## Future Enhancements

- Export reports to PDF/Excel
- Advanced filtering and date range selection
- Email notifications for inventory thresholds
- Multi-user collaboration features
- Real-time data updates with WebSockets
- Mobile app with React Native
- Advanced analytics dashboard
- Custom chart types and visualizations
