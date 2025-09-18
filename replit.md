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
- June 29, 2025: Updated gallery with 7 high-quality Norman Bakes showcase images featuring themed cakes, cupcake collections, and specialty designs
- June 29, 2025: Streamlined order submission and payment process
- June 29, 2025: Updated pricing structure with exact Norman Bakes pricing from provided image:
  - Round cakes: 4" (£50), 6" (£70), 8" (£90)
  - Heart cakes: Small 2-layer (£70), Large 3-layer (£90)
  - Cheesecakes: Single tier (£30), Two tier (£50)
  - Number/Letter cakes: 1 digit (£70), 2 digits (£110)
  - Cupcakes: Standard (£2), Personalised (£2.50), Decorated (£3)
  - Other items: Tray bakes (£30), Bento cakes (£40), Brownies (£22)
- June 29, 2025: Added filling options display and cupcake pricing guidance
- June 29, 2025: Simplified order form to use product type dropdown with text input for details, fixed £10 deposit requirement
- July 1, 2025: Implemented permanent free email notification system using Formspree
- July 1, 2025: Activated Stripe payment processing with live API keys - system fully operational
- July 1, 2025: Created automated email notifications for both new orders and payment confirmations
- July 1, 2025: Added cupcake box of 24 (£48) to product options
- July 1, 2025: Extended extras dropdown with cupcake toppers (personalised £3-£12, highly decorated £6-£24)
- July 1, 2025: Added image upload capability for customer reference photos in orders
- July 1, 2025: Enhanced gallery with 4 new cake images and social media links to Facebook/Instagram
- July 1, 2025: Created comprehensive certifications section displaying hygiene rating and food safety certificates
- July 1, 2025: Updated product descriptions to mention gluten-free options available
- July 1, 2025: Removed all £10 deposit references from pricing sections
- July 2, 2025: Increased maximum orders per date from 2 to 5 orders
- July 2, 2025: Reduced maximum orders per date from 5 to 4 orders
- July 2, 2025: Updated gallery with chef portrait photo and corrected image descriptions
- July 2, 2025: Enhanced certifications section with new Level 2 Food Hygiene certificate
- January 23, 2025: Reduced maximum orders per date from 4 to 2 orders
- January 23, 2025: Extended blocked dates - entire August, additional September/October/November dates, December 15-28 & 31
- September 18, 2025: Extended blocked dates - entire September and October months, additional November dates (1st, 2nd, 4th, 8th, 9th, 14th, 20th, 30th), and December 4th

## User Preferences

Preferred communication style: Simple, everyday language.