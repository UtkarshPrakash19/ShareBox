// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: "filesharing-96da9.firebaseapp.com",
  projectId: "filesharing-96da9",
  storageBucket: "filesharing-96da9.appspot.com",
  messagingSenderId: "1001623695556",
  appId: "1:1001623695556:web:1b3bab80f121bbb5d9d991",
  measurementId: "G-1334NL2TPL",
};

// Initialize Firebase
export const fbApp = initializeApp(firebaseConfig);
