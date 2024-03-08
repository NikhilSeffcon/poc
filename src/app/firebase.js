// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsUfD7H8yBQHfwZGVd1OBaNmMsP9akrbc",
  authDomain: "phone-auth-6332c.firebaseapp.com",
  projectId: "phone-auth-6332c",
  storageBucket: "phone-auth-6332c.appspot.com",
  messagingSenderId: "29897467898",
  appId: "1:29897467898:web:f1c86429f92da57e50a643",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;
