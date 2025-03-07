import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyDsr6cUKl22S3Ir4GEUOW5n4JteXsoTl7o",
    authDomain: "bingo-blitz-91da7.firebaseapp.com",
    projectId: "bingo-blitz-91da7",
    storageBucket: "bingo-blitz-91da7.firebasestorage.app",
    messagingSenderId: "418798383457",
    appId: "1:418798383457:web:52c1ca177dea3d8596d520",
    measurementId: "G-FH4TFV9VJZ"
};






const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const signInWithEmail = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Login Error:", error);
    }
};

const signUpWithEmail = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Signup Error:", error);
    }
};

const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout Error:", error);
    }
};

export { auth, signInWithEmail, signUpWithEmail, logout };

export const db = getFirestore(app);
