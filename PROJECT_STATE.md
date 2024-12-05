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
    ├── services/           # API integration
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
- shadcn/ui (pending)

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
- AWS Amplify: Not configured
- Database: Not configured
- Authentication: Clerk
  - Required: Clerk.dev account and application setup
  - Environment variables configuration
  - Protected routes implementation
- Raindrop.io Integration:
  - Required: Application registration at app.raindrop.io/settings/integrations
  - OAuth authentication flow implementation needed
  - API rate limiting monitoring required

## Next Steps

1. Initialize AWS Amplify
2. Set up Clerk authentication
   - Create Clerk application
   - Install Clerk dependencies
   - Configure environment variables
   - Implement authentication flow
   - Add protected routes with react-router-dom
3. Register application with Raindrop.io
4. Implement OAuth authentication flow for Raindrop.io
5. Create API service layer for Raindrop.io integration
6. Implement tag mapping system between Raindrop.io tags and forces

## Notes

Project setup is now complete with TailwindCSS integration and proper TypeScript configuration. The development environment is ready for implementing core features.

### Authentication Flow

- Users must authenticate to access the application
- Clerk handles:
  - User registration and login
  - Session management
  - Profile management
  - OAuth provider integrations
- Protected routes implemented using react-router-dom
- User state managed through Clerk's React context
- Clerk components and hooks available:
  - <ClerkProvider>
  - <SignIn>
  - <SignUp>
  - <UserButton>
  - useUser()
  - useClerk()
  - useAuth()

### Raindrop.io Integration Notes

- All API timestamps are in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)
- API responses use standard HTTP status codes
- Error handling needed for rate limiting (429 responses)
- Required headers monitoring:
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - X-RateLimit-Reset
