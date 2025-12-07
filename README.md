# AI-Assisted Knowledge Quiz

A full-stack MERN application that generates quizzes on any topic using Google's Gemini AI. Uses JWT for authentication, React for the frontend, and Node.js/Express for the backend.

## Features
- **AI-Generated Quizzes**: Enter any topic, and Gemini generates 5 unique multiple-choice questions.
- **User Accounts**: Secure Signup/Login with JWT.
- **History Tracking**: Saves your quiz results and scores.
- **Interactive UI**: Glassmorphism design with Framer Motion animations.
- **AI Feedback**: Get a witty remark from AI based on your score.

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed or a MongoDB Atlas URI
- Gemini API Key

### 1. Backend Setup
```bash
cd server
npm install
# Create a .env file with:
# MONGODB_URI=...
# JWT_SECRET=...
# GEMINI_API_KEY=...
# PORT=5000
node index.js
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:5173` to play!
