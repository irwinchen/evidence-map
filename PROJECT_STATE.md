# Evidence-Based Systems Map Project State

## Project Structure
```
evidence-map/
├── README.md
├── package.json
├── tsconfig.json
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
- Repository: https://github.com/irwinchen/wptf-systemmapper
- Development environment setup in progress (resolving dependency issues)

### Known Issues
- npm install failing with ENOTEMPTY error
- react-scripts major version update pending

## Environment
- MacBook Pro M4
- VSCode
- Node.js version: 18.19.0 (specified in .nvmrc)
- TypeScript version: 4.4.4

## Dependencies
### Core
- React 18.2.0
- TypeScript 4.4.4
- D3.js 7.8.5
- TailwindCSS (pending)
- shadcn/ui (pending)

### Development
- ESLint 8.57.0
- Prettier 3.2.5
- Jest (via react-scripts)
- React Testing Library

## Infrastructure
- GitHub repository: Created at https://github.com/irwinchen/wptf-systemmapper
- AWS Amplify: Not configured
- Database: Not configured

## Next Steps
1. Switch to Yarn package manager
2. Resolve dependency conflicts
3. Configure TailwindCSS
4. Initialize AWS Amplify

## Notes
Currently transitioning from npm to yarn for better dependency management and version control.