# MovieStream - Social Movie Streaming Platform

A modern movie streaming platform built with React, TypeScript, and Tailwind CSS. Watch movies together with friends, chat in real-time, and get AI-powered insights about the movies you're watching.

## Features

- Browse trending movies from TMDB
- User authentication with Firebase
- Real-time chat and watch together functionality
- AI-powered movie insights and explanations
- Beautiful, responsive UI with Tailwind CSS
- Share invite links with friends

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- TMDB API key
- OpenAI API key

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_TMDB_API_KEY=your_tmdb_api_key
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
   REACT_APP_OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Firebase (Authentication & Realtime Database)
- Socket.io (Real-time chat)
- TMDB API (Movie data)
- OpenAI API (Movie insights)

## Contributing

Feel free to submit issues and enhancement requests!
