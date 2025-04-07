// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArGShwGlHHybvdzZclluCkxFresyc2mWY",
  authDomain: "rubaiyazishan.firebaseapp.com",
  projectId: "rubaiyazishan",
  storageBucket: "rubaiyazishan.firebasestorage.app",
  messagingSenderId: "353437676718",
  appId: "1:353437676718:web:533f67f11b372b2e84a93f",
  measurementId: "G-3R85PTS444"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);