// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDHpo6YVVXfWzpAN6rSPFyelcyTPz8A-Ok",
    authDomain: "cuanku-4b950.firebaseapp.com",
    projectId: "cuanku-4b950",
    storageBucket: "cuanku-4b950.firebasestorage.app",
    messagingSenderId: "461202624012",
    appId: "1:461202624012:web:15b79c7b51628344372829",
    measurementId: "G-M42PNMXCXF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
