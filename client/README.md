# React Chat App (Client)

## Setup & Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Tailwind CSS Setup
If Tailwind is not working, ensure these steps:
1. Make sure `tailwindcss`, `postcss`, and `autoprefixer` are installed:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   ```
2. If not present, create `tailwind.config.js`:
   ```bash
   npx tailwindcss init -p
   ```
3. In `tailwind.config.js`, set:
   ```js
   content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"]
   ```
4. Ensure `@tailwind base;`, `@tailwind components;`, and `@tailwind utilities;` are at the top of `src/index.css`.

## Features
- Register/Login with JWT
- Real-time chat with Socket.io
- User sidebar, chat window, message input
- Axios for API calls
- React Router for navigation

## Folder Structure
- `src/pages/` — Register, Login, Chat pages
- `src/api.js` — Axios API helper
