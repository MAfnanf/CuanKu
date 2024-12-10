import { auth } from '../firebaseConfig.js';
import { createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { db } from '../firebaseConfig.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function () {
    console.log("Register form script loaded");
    const registerForm = document.getElementById('registerForm');

    if (!registerForm) {
        console.error("Register form not found");
        return;
    }

    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log("Form submitted");

        const username = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        console.log({ username, email, password, confirmPassword });

        if (!email || !password || !confirmPassword || !username) {
            alert("Semua field wajib diisi.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Password dan konfirmasi password tidak sesuai.");
            return;
        }

        try {
            console.log("Attempting to create user...");
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("User created:", user);

            console.log("Saving user data to Firestore...");
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
                uid: user.uid
            });

            console.log("Sending verification email...");
            await sendEmailVerification(user);
            alert("Registrasi berhasil! Harap verifikasi email Anda.");
            window.location.href = "../Login/login.html";

        } catch (error) {
            console.error("Registration error:", error);
            alert(`Registrasi gagal: ${error.message}`);
        }
    });
});
