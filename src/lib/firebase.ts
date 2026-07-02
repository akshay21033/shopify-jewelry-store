import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDBX0LEJPaOFQyd2yZnF4vuo8daS0oicj4",
  authDomain: "community-hero-500807.firebaseapp.com",
  projectId: "community-hero-500807",
  storageBucket: "community-hero-500807.firebasestorage.app",
  messagingSenderId: "874487209766",
  appId: "1:874487209766:web:92ee2435e54ceb2759abe7"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom database ID
const db = getFirestore(app, "ai-studio-223a8747-cec0-4b93-ba22-164c9e7ab055");

// Initialize Auth
const auth = getAuth(app);

export { app, db, auth };
