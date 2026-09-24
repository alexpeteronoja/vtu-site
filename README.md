# VTU (Virtual Top-Up) Platform

A full-stack web application that provides a seamless platform for digital utility services. 

## About the Project

This platform is designed to facilitate quick and easy virtual top-ups for everyday services. Users can securely purchase airtime, and data bundles. It includes a user-friendly interface for customers and an administrative dashboard for managing services, users, and transactions.

### Key Features
- **User Authentication**: Secure login and registration system.
- **Utility Services**: Purchasing airtime, data plans.
- **Admin Dashboard**: For monitoring transactions and managing available data plans and users.
- **Modern UI**: A responsive, fast, and interactive user experience.

## Tech Stack Overview
- **Frontend**: React 19, Vite, TailwindCSS, React Query
- **Backend**: Node.js, Express, MongoDB, Mongoose

## Project Structure

- `/frontend`: The React application powered by Vite, TailwindCSS, and React Query.
- `/backend`: The Express server backed by MongoDB and Mongoose.

## Getting Started

To run the full stack locally, you'll need to start both the frontend and backend servers.

### Backend

```bash
cd backend
npm install
npm run test # runs with nodemon
```
See [Backend README](./backend/README.md) for more details.

### Frontend

```bash
cd frontend
npm install
npm run dev
```
See [Frontend README](./frontend/README.md) for more details.
