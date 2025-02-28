// Import the necessary functions from Firebase SDK to initialize the app
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY, // API key from environment variables for security
  authDomain: "filesharing-96da9.firebaseapp.com", // Firebase Auth domain for authentication
  projectId: "filesharing-96da9", // Firebase project ID (unique identifier)
  storageBucket: "filesharing-96da9.appspot.com", // Firebase storage bucket URL (for file storage)
  messagingSenderId: "1001623695556", // Sender ID for Firebase Cloud Messaging
  appId: "1:1001623695556:web:1b3bab80f121bbb5d9d991", // Unique app ID for Firebase
  measurementId: "G-1334NL2TPL", // Measurement ID for Google Analytics
};
// Initialize Firebase with the above configuration
export const fbApp = initializeApp(firebaseConfig);
