# 🚗 Online Road Assistance

Online Road Assistance is a MERN stack web application I built to make
it easier for people to request help when their vehicle breaks down.
Users can explore roadside assistance services and submit requests,
while service providers can manage the requests they receive.

## 🚀 Live Demo

🔗 [Visit Online Road
Assistance](https://online-road-assistance.onrender.com)

## ✨ Features

-   👤 User registration and login
-   🛠️ Browse available roadside assistance services
-   🚘 Submit a request for roadside help
-   📋 View and manage service requests
-   🔧 Service provider section for handling requests
-   ⭐ Submit reviews and feedback
-   🔐 Authentication using JWT

## 🛠️ Tech Stack

**Frontend** - React - Vite - JavaScript - CSS

**Backend** - Node.js - Express.js

**Database** - MongoDB - Mongoose

**Tools & Libraries** - Axios - JSON Web Tokens (JWT) - bcrypt

## 🔄 How It Works

1.  A user creates an account or logs in.
2.  The user browses the available services.
3.  The user submits a roadside assistance request.
4.  Service providers can view and manage service requests.
5.  Users can share feedback through reviews.

## 📂 Project Structure

``` text
online-road-assistance/
├── frontend/   # React application
├── backend/    # Express server, routes, and database logic
└── README.md
```

## ▶️ Run Locally

### Prerequisites

-   Node.js and npm
-   MongoDB or a MongoDB Atlas account

### 1. Clone the repository

``` bash
git clone https://github.com/salmashaik45/online-road-assistance.git
cd online-road-assistance
```

### 2. Start the backend

``` bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

``` env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Add your own MongoDB connection string and a strong JWT secret. Keep
these values private.

Start the backend:

``` bash
npm start
```

### 3. Start the frontend

Open a second terminal from the project root:

``` bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

``` env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

``` bash
npm run dev
```

Open the local URL shown in the terminal.

## ☁️ Deployment

The project frontend and backend are deployed on Render, with MongoDB
Atlas used for the database.

🔗 **Live Website:** [Online Road
Assistance](https://online-road-assistance.onrender.com)

## 👩‍💻 Author

**Salma Shaik**\
[GitHub Profile](https://github.com/salmashaik45)
