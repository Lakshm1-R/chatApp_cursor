# Node.js Chat App (Server)

## Setup & Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in `/server` with:
   ```env
   MONGO_URI=mongodb+srv://lakshmiramalingam2004:1234@cluster0.h9lcnzq.mongodb.net/
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```
3. Start the server:
   ```bash
   npm start
   ```

## Features
- Express REST API for auth, users, messages
- MongoDB models for User and Message
- JWT authentication
- bcrypt password hashing
- Real-time messaging with Socket.io

## Folder Structure
- `models/` — Mongoose models
- `routes/` — Express route handlers
- `index.js` — Main server file 