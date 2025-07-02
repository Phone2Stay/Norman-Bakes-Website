# Norman Bakes - Professional Cake Business Website

## Overview
A complete e-commerce website for Norman Bakes, featuring online cake ordering, payment processing, gallery, and customer management.

## Features
- **Full Product Catalog**: Cupcakes, cheesecakes, custom cakes, and more
- **Stripe Payment Integration**: Secure payment processing with live API keys
- **Order Management**: Customer orders with email notifications
- **Image Gallery**: Showcase of cake creations with social media links
- **Booking System**: Date availability with maximum 5 orders per day
- **Certifications Display**: Food hygiene ratings and certificates
- **Allergen Information**: Comprehensive allergen details and cross-contamination warnings
- **Responsive Design**: Mobile-friendly black and gold theme

## Technology Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: In-memory storage (ready for PostgreSQL)
- **Payments**: Stripe integration
- **Email**: FormSubmit.co integration
- **Build**: Vite + esbuild

## Quick Setup

### Prerequisites
- Node.js 18+ 
- npm

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables Required
Create a `.env` file with:
```
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment Options

### Option 1: Static Hosting (Netlify, Vercel, etc.)
```bash
npm run build
# Upload the dist folder to your hosting provider
```

### Option 2: Node.js Hosting (Digital Ocean, AWS, etc.)
```bash
npm run build
npm start
```

### Option 3: Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## Key Configuration Files
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Build configuration
- `tailwind.config.ts` - Styling configuration
- `drizzle.config.ts` - Database configuration (if using PostgreSQL)

## Important Notes
- All images are included in `attached_assets/` folder
- Email notifications currently use FormSubmit.co (free service)
- Maximum 5 orders per collection date
- Full payment system active (no deposits except "Other Cake" at £20)

## Support
Created by Replit Agent for Norman Bakes
Contact: normanbakes38@gmail.com

## License
Private - All rights reserved to Norman Bakes