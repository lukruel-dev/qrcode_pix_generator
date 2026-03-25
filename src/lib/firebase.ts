import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "qrcode-pix-generator-01234bc",
  appId: "1:158835475181:web:767d4b65cb415b09af42e4",
  storageBucket: "qrcode-pix-generator-01234bc.firebasestorage.app",
  apiKey: "AIzaSyDUunRtASebvCg4Vp6jWC_iIcnglrD70F4",
  authDomain: "qrcode-pix-generator-01234bc.firebaseapp.com",
  messagingSenderId: "158835475181",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
