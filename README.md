# Online Road Assistance 🚗

A full-stack MERN application that helps users request roadside
assistance and enables service providers to manage incoming requests.

**Live website:** https://online-road-assistance.onrender.com\
**Backend API:** https://online-road-assistance-api.onrender.com\
**API health check:**
https://online-road-assistance-api.onrender.com/api/test

## Features

### Customers

-   Register and log in securely.
-   Manage vehicle information.
-   Request roadside assistance, including towing, fuel delivery,
    flat-tire assistance, battery assistance, and mechanic support.
-   Use browser location capture where available.
-   Track service-request status.
-   Verify service start using an OTP.
-   Submit reviews.

### Service providers

-   Register and log in.
-   Access a provider dashboard.
-   Manage service requests and view earnings information.

### Application

-   React frontend and Express REST API.
-   MongoDB database using Mongoose.
-   JWT-based authentication and protected routes.
-   Password hashing with bcrypt/bcryptjs.
-   Axios API client and CORS configuration.

## Tech Stack

-   **Frontend:** React, Vite, JavaScript, Axios
-   **Backend:** Node.js, Express
-   **Database:** MongoDB Atlas, Mongoose
-   **Authentication:** JSON Web Tokens (JWT), bcrypt/bcryptjs
-   **Deployment:** Render (frontend and backend), MongoDB Atlas
    (database)

## Repository Structure

``` text
online-road-assistance/
├── frontend/   # React + Vite application
└── backend/    # Express API and database models/routes
```

## Run Locally

### Prerequisites

-   Node.js and npm
-   A MongoDB database (local MongoDB or MongoDB Atlas)
-   Git

### 1. Clone the repository

``` bash
git clone https://github.com/salmashaik45/online-road-assistance.git
cd online-road-assistance
```

### 2. Configure the backend

``` bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

``` env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
```

Replace the example values with your own database connection string and
a strong JWT secret. Do not commit `.env` files or credentials to
GitHub.

Start the backend:

``` bash
npm start
```

The API should run at `http://localhost:5000` when using the local port
shown above. The health-check endpoint is:

``` text
http://localhost:5000/api/test
```

### 3. Configure the frontend

Open a second terminal from the repository root:

``` bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

``` env
VITE_API_URL=http://localhost:5000/api
```

Vite exposes variables prefixed with `VITE_` to frontend code. Do not
put secrets in frontend environment variables.

Start the frontend development server:

``` bash
npm run dev
```

Use the local URL printed by Vite in the terminal.

## Deployment

The application is deployed using Render and MongoDB Atlas.

-   **Frontend Static Site:**
    https://online-road-assistance.onrender.com
-   **Backend Web Service:**
    https://online-road-assistance-api.onrender.com
-   **Production frontend API variable:**
    `VITE_API_URL=https://online-road-assistance-api.onrender.com/api`

For a separate deployment, configure these backend environment variables
in the hosting dashboard:

-   `MONGO_URI` --- MongoDB connection string
-   `JWT_SECRET` --- strong secret used to sign JWTs
-   `PORT` --- supplied by many hosting platforms; the server uses
    `process.env.PORT` when available

Configure the frontend build environment variable `VITE_API_URL` to
point to the deployed API, including the `/api` suffix. The MongoDB
Atlas network access list must permit connections from the backend
hosting service.

## Available Scripts

### Backend (`backend/`)

``` bash
npm start
npm run server
```

-   `npm start` starts the API with Node.js.
-   `npm run server` starts the API with Nodemon for development.

### Frontend (`frontend/`)

``` bash
npm run dev
npm run build
npm run lint
npm run preview
```

-   `npm run dev` starts the Vite development server.
-   `npm run build` creates the production build in `dist/`.
-   `npm run lint` runs ESLint.
-   `npm run preview` previews the production build locally.

## Security Notes

-   Keep database credentials and JWT secrets in environment variables.
-   Never commit `.env` files, passwords, access tokens, or other
    secrets.
-   Use a strong, unique `JWT_SECRET` in production.
-   Restrict database network access to the addresses/ranges required by
    your deployment.

## Future Improvements

Potential improvements include automated tests, monitoring and alerting,
and additional accessibility and mobile usability checks.

## Author

**Salma Shaik**\
GitHub: [@salmashaik45](https://github.com/salmashaik45)

------------------------------------------------------------------------

If you find a problem or have a suggestion, please open an issue in the
GitHub repository.
