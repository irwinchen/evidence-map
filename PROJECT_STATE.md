# Evidence-Based Systems Map Project State

## Project Structure

```
evidence-map/
├── README.md
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── components/
    │   ├── system-map/     # Force-directed graph visualization
    │   ├── evidence/       # Evidence collection & rating
    │   ├── relationships/  # Connection management
    │   └── analysis/       # Data analysis & metrics
    ├── hooks/              # Custom React hooks
    ├── pages/              # Top-level page components
    │   ├── AboutPage.tsx   # About, systems info, WPTF info
    │   ├── MapPage.tsx     # D3 visualization container
    │   ├── ContributorsPage.tsx  # Contributors list
    │   ├── SubmitPage.tsx  # Evidence submission form
    │   └── ContactPage.tsx # Contact form
    ├── services/           # API integration
    │   ├── mongodb.ts      # MongoDB service layer
    │   └── mongodb.test.ts # Database connection tests
    ├── types/             # TypeScript interfaces
    └── utils/             # Helper functions
```

## Current State

- Project initialized with basic configuration
- React application structure created
- Core component directories established
- Repository: https://github.com/irwinchen/evidence-map
- Development environment setup completed
- Successfully migrated to Yarn package manager
- Dependency conflicts resolved and versions aligned
- TailwindCSS configured and integrated
- TypeScript configuration optimized for React 18
- Successfully deployed to AWS Amplify
- Added react-router-dom for page navigation
- Created top-level pages:
  - About page with sections for systems thinking, map creation, and WPTF info
  - Map page with placeholder for D3 visualization
  - Contributors page showing registered contributors
  - Submit page with evidence submission form (requires authentication)
  - Contact page with contact form
- Implemented basic navigation structure with header menu
- MongoDB Atlas setup completed:
  - Cluster created and configured
  - Network access configured for development and AWS Amplify
  - Database user created and connection string secured
  - MongoDB service layer implemented with TypeScript interfaces
  - Database operations tested and verified

### Known Issues

None currently

## Environment

- MacBook Pro M4
- VSCode
- Node.js version: 18.19.0 (specified in .nvmrc)
- TypeScript version: 5.3.3
- React version: 18.2.0

## Dependencies

### Core

- React 18.2.0
- TypeScript 5.3.3
- D3.js 7.8.5
- TailwindCSS 3.4.16
- React Router DOM 7.0.2
- shadcn/ui (pending)
- mongodb ^6.11.0
- dotenv ^16.4.7

### Authentication (Clerk)

- @clerk/clerk-react ^4.30.3
- @clerk/themes ^1.7.9
- @clerk/types ^3.60.2
- @clerk/clerk-sdk-node ^4.13.4 (for server-side operations)
- react-router-dom ^6.21.1 (for protected routes)

### Development

- ESLint 8.57.0
- Prettier 3.2.5
- Jest (via react-scripts)
- React Testing Library
- PostCSS
- Autoprefixer
- ts-node ^10.9.2

### API Integration

#### Authentication (Clerk)

- User authentication and management
- Required features:
  - Email/password authentication
  - OAuth providers support
  - User sessions management
  - Protected routes
  - User profile management
- Environment variables needed:
  - REACT_APP_CLERK_PUBLISHABLE_KEY
  - REACT_APP_CLERK_SECRET_KEY

#### Raindrop.io API Requirements

- OAuth 2.0 authentication
- API rate limit: 120 requests per minute per authenticated user
- Required endpoints:
  - Authentication (/v1/authentication)
  - Tags (/v1/tags)
  - Raindrops (/v1/raindrops)
- CORS support enabled
- Content-Type: application/json for requests/responses

## Infrastructure

- GitHub repository: https://github.com/irwinchen/evidence-map
- AWS Amplify: Successfully deployed and configured
- Authentication: Clerk
  - Required: Clerk.dev account and application setup
  - Environment variables configuration
  - Protected routes implementation
- Raindrop.io Integration:
  - Required: Application registration at app.raindrop.io/settings/integrations
  - OAuth authentication flow implementation needed
  - API rate limiting monitoring required
- MongoDB Atlas:
  - Cluster created and configured
  - Network access configured for development (162.83.203.84) and AWS Amplify (0.0.0.0/0)
  - Database user created with proper permissions
  - Connection string secured in .env file
  - Service layer implemented with TypeScript interfaces
  - Database operations tested and verified
  - Environment variables configured:
    - MONGODB_URI
    - MONGODB_DB_NAME

### Database (MongoDB)

[Schema Design section remains exactly the same]

## Next Steps

1. Set up Clerk authentication

   - Create Clerk application
   - Install Clerk dependencies
   - Configure environment variables
   - Implement authentication flow
   - Add protected routes with react-router-dom

2. Register application with Raindrop.io
3. Implement OAuth authentication flow for Raindrop.io
4. Create API service layer for Raindrop.io integration
5. Implement tag mapping system between Raindrop.io tags and forces
6. Implement D3 visualization in Map page
7. Connect Submit form with backend services
8. Add authentication check for Submit page access

## Notes

Project setup is now complete with TailwindCSS integration and proper TypeScript configuration. The development environment is ready for implementing core features.

### Authentication Flow

[Authentication Flow section remains exactly the same]

### Raindrop.io Integration Notes

[Raindrop.io Integration Notes section remains exactly the same]
