// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCf_JWhvCVZL6OsVG6pi0fI2LHNPkajq0k",
  authDomain: "mintmonkweb.firebaseapp.com",
  projectId: "mintmonkweb",
  storageBucket: "mintmonkweb.firebasestorage.app",
  messagingSenderId: "548985459911",
  appId: "1:548985459911:web:bfa3ea57f9b170c4b51ae2",
  measurementId: "G-F4P19K4E2G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase services
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };