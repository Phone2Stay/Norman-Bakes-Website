# Norman Bakes - Cake Ordering System

## Overview

Norman Bakes is a premium cake business website built as a full-stack application serving custom celebration cakes in Barry, Vale of Glamorgan. The system provides a complete online presence with gallery showcase, order management, and integrated payment processing through Stripe.

## System Architecture

### Frontend Architecture
The frontend is built using **React 18** with **TypeScript** and styled using **Tailwind CSS** with the **shadcn/ui** component library. The application uses:
- **Vite** as the build tool and development server
- **Wouter** for client-side routing (lightweight alternative to React Router)
- **TanStack Query** for server state management and API calls
- **React Hook Form** with **Zod** validation for form handling
- **Stripe Elements** for secure payment processing

### Backend Architecture
The backend is an **Express.js** server with TypeScript that provides:
- RESTful API endpoints for orders and seasonal deals
- **Stripe** integration for payment processing
- **Nodemailer** for email notifications
- Session management with **connect-pg-simple**
- In-memory storage implementation (ready for database integration)

### Data Storage Strategy
Currently implements an **in-memory storage** pattern with a clean interface (`IStorage`) that can be easily swapped for a database implementation. The system is prepared for **PostgreSQL** integration using:
- **Drizzle ORM** for database operations
- **Neon Database** serverless PostgreSQL (based on dependencies)
- Migration support through drizzle-kit

## Key Components

### Core Business Logic
- **Order Management**: Complete order creation, validation, and payment processing workflow
- **Seasonal Deals**: Dynamic promotional content management
- **Gallery System**: Image showcase with lightbox functionality
- **Contact Management**: Multi-channel communication (email, social media)

### UI Components
- **Custom Design System**: Built on shadcn/ui with Norman Bakes branding
- **Responsive Layout**: Mobile-first design with Tailwind CSS
- **Interactive Elements**: Image galleries, forms, navigation, and payment interfaces
- **Accessibility**: Proper ARIA labels and keyboard navigation support

### Payment Integration
- **Stripe Payment Elements**: Secure payment form components
- **Deposit System**: 50% deposit requirement with full payment tracking
- **Order Confirmation**: Automated email notifications for new orders

## Data Flow

1. **Customer Journey**: Home → Gallery → Deals → Order Form → Payment
2. **Order Processing**: Form submission → Validation → Stripe payment → Email notification → Order storage
3. **Admin Notifications**: New orders trigger email alerts to business owner
4. **Payment Flow**: Stripe handles secure payment processing with webhook support ready

## External Dependencies

### Payment Services
- **Stripe**: Payment processing and secure checkout
- **Stripe Elements**: Frontend payment components

### Email Services
- **Nodemailer**: Email delivery system
- **Gmail SMTP**: Email service provider (configurable)

### Database Services
- **Neon Database**: Serverless PostgreSQL (configured but not active)
- **Drizzle ORM**: Type-safe database operations

### UI and Development
- **shadcn/ui**: Component library based on Radix UI
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library
- **React Hook Form**: Form state management

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Development**: Hot reload with Vite middleware integration

### Environment Configuration
Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `STRIPE_SECRET_KEY`: Stripe server-side API key
- `VITE_STRIPE_PUBLIC_KEY`: Stripe client-side public key
- `EMAIL_USER`: Gmail account for notifications
- `EMAIL_PASS`: Gmail app password

### Production Readiness
- **Error Handling**: Comprehensive error boundaries and validation
- **Security**: CORS configuration, input validation, secure payment processing
- **Performance**: Optimized builds, lazy loading, and efficient state management
- **Monitoring**: Request logging and error tracking capabilities

## Changelog
- June 29, 2025: Initial setup and complete website build
- June 29, 2025: Integrated actual Norman Bakes logo
- June 29, 2025: Updated order form to single button flow
- June 29, 2025: Enhanced gallery with 12 professional cake images
- June 29, 2025: Streamlined order submission and payment process

## User Preferences

Preferred communication style: Simple, everyday language.