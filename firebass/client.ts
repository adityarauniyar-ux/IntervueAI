// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth,GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCQqxdXwrMkzNNwNiHgRkehIk-il_fNv-s",
  authDomain: "intervueai-5d517.firebaseapp.com",
  projectId: "intervueai-5d517",
  storageBucket: "intervueai-5d517.firebasestorage.app",
  messagingSenderId: "495237745312",
  appId: "1:495237745312:web:927213f6fa2a94ef8197c5"
};

// Initialize Firebase
const app = !getApps.length ?  initializeApp(firebaseConfig) : getApp();

export const provider = new GoogleAuthProvider();
export const auth = getAuth(app);
auth.languageCode = 'en';
export const db = getFirestore(app);

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    const user = result.user;

    const idToken = await user.getIdToken();

    // Send to server to store in DB and set session
    await fetch("/api/google-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        idToken,
      }),
    });

    return { user, token, idToken }; // ✅ returning all
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};
