## API Integration

The application is designed to be fully integrated with a .NET Core backend. The `services/` directory contains all the API client modules, ensuring that components remain clean and focused on their presentation logic.

## Getting Started

To run the project locally, follow these steps:

1.  Clone the repository:
    `git clone https://github.com/Asifmzn12/Sky8pay-New`
2.  Navigate to the project directory:
    `cd sky8pay`
3.  Install dependencies:
    `npm install`
4.  Start the development server:
    `npm run dev`

The application will be available at `http://localhost:5173`


# Sky8pay React Application

This is a large-scale React application built with Vite and integrated with a .NET Core API. This document provides an overview of the project structure and key features.

---

## Project Structure

The project follows a scalable and modular architecture to handle the complexity of a growing application.

### Core Directories
sky8pay/
├── node_modules/
├── public/
├── src/
│   ├── assets/                 // All static files like images, fonts
│   ├── components/              // Reusable UI components (buttons, cards, modals)
│   ├── config/                  // Configuration files (API endpoints, environment variables)
│   ├── contexts/                // React Context for global state management (AuthContext, ThemeContext)
│   ├── hooks/                   // Custom React hooks (e.g., useFetch, useAuth)
│   ├── layouts/                 // Components for overall page layout (e.g., DashboardLayout)
│   ├── pages/                   // Individual page components (Dashboard.jsx, Sales.jsx)
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx
│   │   ├── Sales/
│   │   │   └── Sales.jsx
│   │   └── ...
│   ├── services/                // API service layer for all backend interactions
│   │   ├── api.js               // Main API client (e.g., Axios instance)
│   │   ├── authService.js       // Functions for login, logout, token management
│   │   ├── fundRequestService.js // API calls related to fund requests
│   │   └── ...
│   ├── utils/                   // Utility functions (data formatting, validators)
│   ├── App.jsx                  // Main application component
│   └── main.jsx                 // Entry point of the application
├── .gitignore
├── package.json
└── vite.config.js