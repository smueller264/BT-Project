import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};


if (Object.values(firebaseConfig).some(value => value === undefined)) {
  console.error('Some Firebase configuration values are undefined. Please check your environment variables.');
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

// Test Firestore connection
import { collection, getDocs } from 'firebase/firestore';

async function testFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, 'test'));
    console.log('Firestore connection successful. Number of documents in test collection:', querySnapshot.size);
  } catch (error) {
    console.error('Error connecting to Firestore:', error);
  }
}

testFirestore();