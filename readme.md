# NexusNews 📰

NexusNews is a modern, full-stack mobile application built with React Native (Expo) and a Node.js Express backend. It serves as a comprehensive news aggregator that delivers top headlines, allows categorization of news, and includes premium features designed to provide an excellent reading experience.

## ✨ Features

- **Full-stack Authentication**: Secure user registration and login via JWT.
- **Live News Feed**: Fetches real-time, categorized top headlines using backend API integration.
- **Infinite Scrolling & Pull-to-Refresh**: Seamless, dynamic loading of new articles as you scroll down the feed.
- **Discover & Search**: Look up articles by keywords with a dedicated search tab.
- **Bookmarks & Saved Articles**: Save your favorite articles locally to read them anytime later using persistent Zustand storage.
- **Text-To-Speech (Read Aloud)**: Tap the play button on any article to have the app read the news aloud to you natively via `expo-speech`.
- **Premium UI & Animations**: Cascading animated entrance for news cards (`react-native-reanimated`), physical haptic feedback (`expo-haptics`), and a dynamic date-time home header.
- **Quick Theme Toggle**: A convenient moon/sun icon in the upper right corner allows seamless switching between Light and Dark mode.
- **Related Articles**: A smart recommendation carousel at the bottom of the article view displaying similar news.
- **Article Sharing**: Native social share capabilities directly from the news list.

## 🛠 Tech Stack

**Frontend (Mobile App)**
- [React Native](https://reactnative.dev/) using [Expo](https://expo.dev/)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) (Global state management)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) (Optimized animations)
- [Expo Speech](https://docs.expo.dev/versions/latest/sdk/speech/) (Text-to-speech engine)

**Backend (API Server)**
- [Node.js](https://nodejs.org/en) & [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) (Database via Mongoose)
- [JSON Web Tokens (JWT)](https://jwt.io/) (Authentication framework)
- Axios (External API resolution)

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and MongoDB installed on your local machine. To test the app on a physical device, download the [Expo Go](https://expo.dev/client) app on your iOS or Android phone.

### 1. Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd nexusnews-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add your environment variables to a `.env` file (MongoDB URI, JWT Secret, News API Key).
4. Start the Express server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Open a new terminal and navigate to the mobile app folder:
   ```bash
   cd NexusNews
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `utils/axiosClient.ts` to ensure the base URL targets your running backend server's local IPv4 network address (`http://YOUR_LOCAL_IP:PORT/api`).
4. Start the Expo development server:
   ```bash
   npx expo start
   ```

From there, simply scan the QR code printed in the terminal using the Expo Go app to view NexusNews live on your device!

## 🤝 Project Structure

- `nexusnews-backend/`: The Express.js web server that brokers interactions with the database and external APIs.
- `NexusNews/`: The Expo React Native frontend mobile application.
- `NexusNews/app/`: File-based Expo Router layout architecture for seamless screen navigation.
- `NexusNews/components/`: Reusable UI components including Article Cards and Headers.
- `NexusNews/store/`: Zustand state management persistence for auth state and bookmarks.
