# VTU Site Backend

This is the backend for the VTU Site, built with Node.js, Express, and MongoDB.

## Tech Stack

- **Node.js** & **Express**: For the core server and API routing.
- **MongoDB** & **Mongoose**: Database and ODM.
- **Authentication**: JWT (`jsonwebtoken`) and `bcrypt` for secure passwords.
- **Logging**: `pino`, `@logtail/pino`, `morgan`.
- **Validation**: `validator`.
- **Other**: `cors`, `dotenv`, `node-cron`, `axios`.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Create a `.env` file based on `.env.example`.

3. Run the server:
   - For development: `npm run test` (uses nodemon)
   - For production: `npm run start` or `npm run start:prod`
