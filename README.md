# Online Road Assistance System 🚗

This is a MERN stack project I built to help users find roadside
assistance when they need help with their vehicles.

## Live Website

[Click here to visit Online Road
Assistance](https://online-road-assistance.onrender.com)

## Features

-   User registration and login
-   Browse roadside assistance services
-   Connect with service providers
-   Request roadside assistance
-   Track service requests
-   Submit reviews

## Technologies Used

-   **Frontend:** React, Vite, JavaScript
-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB
-   **Other tools:** Axios, JWT

## Run Locally

1.  Clone this repository:

    ``` bash
    git clone https://github.com/salmashaik45/online-road-assistance.git
    cd online-road-assistance
    ```

2.  Install and start the backend:

    ``` bash
    cd backend
    npm install
    npm start
    ```

    Create a `.env` file in the `backend` folder with your `MONGO_URI`
    and `JWT_SECRET` values before starting the server.

3.  Open another terminal and start the frontend:

    ``` bash
    cd frontend
    npm install
    npm run dev
    ```

    Set `VITE_API_URL` in `frontend/.env` to `http://localhost:5000/api`
    for local development.

## Author

Salma Shaik · [GitHub](https://github.com/salmashaik45)
