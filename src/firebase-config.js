import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, getDocs, collection } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCiH1NRSdyExDe8XNqxMC3PSdLn5ssz5Pg",
    authDomain: "reacttutorial-e5dc8.firebaseapp.com",
    databaseURL: "https://reacttutorial-e5dc8-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "reacttutorial-e5dc8",
    storageBucket: "reacttutorial-e5dc8.appspot.com",
    messagingSenderId: "1016024510208",
    appId: "1:1016024510208:web:c70402bcfa5a6bc55bcde5"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const docs = getDocs(collection(db, 'messages'));
