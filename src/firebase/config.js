import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TO THE USER: Replace the below with your own Firebase configuration keys
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "skiez-pharma.firebaseapp.com",
  projectId: "skiez-pharma",
  storageBucket: "skiez-pharma.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Cloudinary placeholder config
export const cloudinaryConfig = {
  cloudName: 'YOUR_CLOUD_NAME',
  uploadPreset: 'YOUR_UPLOAD_PRESET'
};
