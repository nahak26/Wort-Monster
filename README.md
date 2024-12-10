# Wort Monster Web App Documentation

## Overview

Wort Monster is an innovative web application designed to help users master complex German compound words. The application provides an interactive interface for building, managing, and learning compound words, along with their sub-words and translations. Integrated tools like Google OAuth for authentication, Supabase for database management, and browser-based Text-to-Speech (TTS) functionality make the learning process seamless and engaging.


## Setup Instructions

### Clone the Repository
To set up the project locally, follow these steps:

1. Clone the repository:
```bash
git clone git@git.ucsc.edu:tvu8/wort-monster.git
cd wort-monster
```

### Frontend Setup
1. Create a React app for the project:
```bash
npx create-react-app german-compound-words
cd german-compound-words
```

2. Install Tailwind CSS:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. Configure Tailwind in `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

4. Update the file `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

5. Install Firebase:
```bash
npm install firebase
```

6. Set up a `.env` file and configure environment variables:
```
SUPABASE_URL=https://jvlfcwlfsgmakiqytdbg.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2bGZjd2xmc2dtYWtpcXl0ZGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAwOTA2NTEsImV4cCI6MjA0NTY2NjY1MX0.pwkY42n_-Uu8XfHx28y3lNvMLe4xv_LjGI5jWldQbC4
REACT_APP_FIREBASE_API_KEY=AIzaSyChh_Mor-VbJQ7aGAaomY6hl9XaPi7Kj9I
REACT_APP_FIREBASE_AUTH_DOMAIN=wort-monster.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=wort-monster
REACT_APP_FIREBASE_STORAGE_BUCKET=wort-monster.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=639622162800
REACT_APP_FIREBASE_APP_ID=1:639622162800:web:723441ed3be049439e47b5
REACT_APP_FIREBASE_MEASUREMENT_ID=G-VW0E2GD4KR

```

7. Start the frontend development server:
```bash
npm start
```

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```


2. Configure Supabase in `.env`:
```
SUPABASE_URL=<your_supabase_url>
SUPABASE_ANON_KEY=<your_supabase_anon_key>
```

3. Start the backend server:
```bash
npm start
```
4. Access the server at `http://localhost:5001`.

