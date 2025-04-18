# Stability One
Proof of Concept centralized over-colalteralized stablecoin project using the Capital One API.

Unaffiliated with Capital One. This is a personal project not intended for real use.

Solidity Smart contracts for minting ERC-20 stablecoins on Arbitrum in the /contracts folder. The rest of this project is the front end for a user application.

Unaudited.

## Features

- Capital One OAuth integration for secure authentication
- Dashboard with account summaries and balances
- Spending category breakdown and visualization
- Upcoming bills tracking
- Recent transaction history with filtering and pagination
- Responsive design for both desktop and mobile devices

## Prerequisites

- Node.js v16+ and npm
- Capital One Developer Account and API credentials (for production use)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Capital One API Configuration
CAPITAL_ONE_CLIENT_ID=your_client_id
CAPITAL_ONE_CLIENT_SECRET=your_client_secret
CAPITAL_ONE_REDIRECT_URI=http://localhost:5000/callback

# Session Secret (for production, use a strong random value)
SESSION_SECRET=your_session_secret
```

For the frontend, create a `.env.local` file with variables prefixed with VITE_:

```
VITE_CAPITAL_ONE_CLIENT_ID=your_client_id
VITE_CAPITAL_ONE_REDIRECT_URI=http://localhost:5000/callback
```

## Installation

Follow these steps to set up the project from scratch:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/findash.git
   cd findash
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Verify that all required dependencies are installed, particularly:
   ```bash
   npm install axios @tanstack/react-query
   ```

## Running the Application

### Development Mode

To run the application in development mode:

```bash
npm run dev
```

This command starts both the Express backend server and the Vite development server with hot-module replacement enabled. The application will be available at http://localhost:5000.

### Production Build

To create a production build:

```bash
npm run build
```

To run the production build:

```bash
npm start
```

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── dashboard/  # Dashboard-specific components
│   │   │   └── ui/         # Reusable UI components (shadcn)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and API client
│   │   ├── pages/          # Main page components
│   │   ├── App.tsx         # Main App component
│   │   └── main.tsx        # Entry point
│   └── index.html          # HTML template
├── server/                 # Backend Express server
│   ├── middleware/         # Express middleware
│   ├── services/           # Service layer for external APIs
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Data storage interface
│   └── vite.ts             # Vite integration
├── shared/                 # Shared code between frontend and backend
│   └── schema.ts           # TypeScript schemas and types
└── various config files    # Configuration files for the project
```

## Authentication Flow

1. User clicks "Log in with Capital One" on the home page
2. User is redirected to the Capital One OAuth page
3. After authentication, Capital One redirects back to the application with an authorization code
4. The application exchanges the code for an access token
5. The application uses the token to fetch financial data from Capital One API

## Troubleshooting

### Common Issues

1. **"process is not defined" error in browser**:
   - Make sure to use `import.meta.env.VITE_*` for environment variables in client-side code, not `process.env.*`.

2. **API Authentication Errors**:
   - Verify that your Capital One API credentials are correct
   - Check that the redirect URI matches exactly what's configured in your Capital One developer account

3. **Missing Dependencies**:
   - If you encounter errors about missing packages, run `npm install` to ensure all dependencies are installed

4. **Port Conflicts**:
   - If port 5000 is already in use, modify the port in `.env` file and update corresponding references

## Security Notes

- This application uses OAuth 2.0 for secure authentication
- API credentials should never be included in client-side code
- In production, use HTTPS and secure cookies
- Implement proper token refresh and expiration handling
- Consider implementing rate limiting for API endpoints

## License

[MIT](LICENSE)

## Acknowledgements

This application is built with:
- React
- TypeScript
- Express
- Vite
- TanStack Query
- Tailwind CSS
- shadcn/ui