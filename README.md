# Data Visualisation Dashboard

A web-based system for analyzing procurement, sales, and inventory history for retail management.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL
- React
- Tailwind CSS
- Recharts

## Core Features

1. Data Visualization Dashboard

   - Line charts showing inventory, procurement amount, and sales amount
   - Multi-product comparison capability
   - Historical data analysis over multiple days

2. User Authentication

   - Custom database authentication
   - No third-party auth services

3. Excel Import

   - Upload and parse Excel/CSV files
   - Automatic data storage to database

4. Deployment
   - Vercel hosting

## Development Phases

### Phase 1: Project Setup & Database Schema

- Initialize Next.js with TypeScript and Tailwind
- Set up Prisma with database models (User, Product, DailyRecord)
- Configure database connection

### Phase 2: Data Import & API Development

- Create seed script for initial data import
- Build API routes for product data
- Implement authentication endpoints

### Phase 3: Frontend & Visualization

- Build dashboard page with product selector
- Integrate Recharts for data visualization
- Create login page

### Phase 4: Deployment

- Deploy to Vercel
- Configure environment variables

## Database Schema

- **User**: Authentication data
- **Product**: Product information and opening inventory
- **DailyRecord**: Daily procurement, sales, and inventory records

## Getting Started

1. Install dependencies
2. Configure `.env` with database connection
3. Run Prisma migrations
4. Seed initial data
5. Start development server
