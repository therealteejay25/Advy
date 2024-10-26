// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWVr1IK4YJPgA9EepJthdC_0NhN_VcrrQ",
  authDomain: "advy-main.firebaseapp.com",
  projectId: "advy-main",
  storageBucket: "advy-main.appspot.com",
  messagingSenderId: "998562874697",
  appId: "1:998562874697:web:4131d9d04515bb062d4698",
  measurementId: "G-5RPVT29J1Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app)