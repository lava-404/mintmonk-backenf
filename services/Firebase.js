// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCf_JWhvCVZL6OsVG6pi0fI2LHNPkajq0k",
  authDomain: "mintmonkweb.firebaseapp.com",
  projectId: "mintmonkweb",
  storageBucket: "mintmonkweb.firebasestorage.app",
  messagingSenderId: "548985459911",
  appId: "1:548985459911:web:bfa3ea57f9b170c4b51ae2",
  measurementId: "G-F4P19K4E2G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export { auth, provider };
