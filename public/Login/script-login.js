import { auth } from '../firebaseConfig.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js"; 
import { db } from '../firebaseConfig.js';

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            alert("Email dan password wajib diisi.");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                alert("Harap verifikasi email Anda sebelum login.");
                return;
            }

            const userDoc = await getDoc(doc(db, "users", user.uid));
            const username = userDoc.data().username;
            // Menyimpan nama pengguna di localStorage
            localStorage.setItem('username', username);

            // Simpan data user ke localStorage
            localStorage.setItem('isLoggedIn', 'true');

            alert("Login berhasil!");
            window.location.href = "../index.html";
        } catch (error) {
            handleLoginError(error);
        }
    });

    function handleLoginError(error) {
        // Tangani pesan error spesifik dari Firebase
        switch (error.code) {
            case "auth/user-not-found":
                alert("User tidak ditemukan. Silakan periksa email Anda.");
                break;
            case "auth/wrong-password":
                alert("Password salah. Silakan coba lagi.");
                break;
            case "auth/too-many-requests":
                alert("Terlalu banyak percobaan login. Silakan coba lagi nanti.");
                break;
            default:
                alert(`Login gagal: ${error.message}`);
        }
    }
});
