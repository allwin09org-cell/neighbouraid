import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- PASTE YOUR FIREBASE CONFIG HERE ---
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const sections = ['hero', 'auth', 'post', 'feed'];
const authForm = document.getElementById('auth-form');
const requestForm = document.getElementById('request-form');
const logoutBtn = document.getElementById('logout-btn');
const requestsContainer = document.getElementById('requests-container');

let isLoginMode = true;

// --- Section Navigation ---
window.showSection = (sectionId) => {
    sections.forEach(s => {
        document.getElementById(`${s}-section`).classList.remove('active');
    });
    document.getElementById(`${sectionId}-section`).classList.add('active');
};

// --- Authentication UI Logic ---
document.getElementById('toggle-signup').addEventListener('click', () => {
    isLoginMode = false;
    document.getElementById('toggle-signup').classList.add('active');
    document.getElementById('toggle-login').classList.remove('active');
    document.getElementById('auth-submit-btn').innerText = 'Sign Up';
});

document.getElementById('toggle-login').addEventListener('click', () => {
    isLoginMode = true;
    document.getElementById('toggle-login').classList.add('active');
    document.getElementById('toggle-signup').classList.remove('active');
    document.getElementById('auth-submit-btn').innerText = 'Login';
});

// --- Auth State Observer ---
onAuthStateChanged(auth, (user) => {
    const authOnly = document.querySelectorAll('.auth-only');
    const guestOnly = document.querySelectorAll('.guest-only');
    
    if (user) {
        authOnly.forEach(el => el.classList.remove('hidden'));
        guestOnly.forEach(el => el.classList.add('hidden'));
        document.getElementById('user-welcome').innerText = `Welcome, ${user.email.split('@')[0]}`;
        loadRequests();
    } else {
        authOnly.forEach(el => el.classList.add('hidden'));
        guestOnly.forEach(el => el.classList.remove('hidden'));
        showSection('hero');
    }
});

// --- Login / Signup Action ---
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-password').value;

    try {
        if (isLoginMode) {
            await signInWithEmailAndPassword(auth, email, pass);
            showToast("Welcome back!");
        } else {
            await createUserWithEmailAndPassword(auth, email, pass);
            showToast("Account created successfully!");
        }
        showSection('feed');
    } catch (error) {
        showToast(error.message, true);
    }
});

// --- Logout ---
logoutBtn.addEventListener('click', () => signOut(auth));

// --- Post Request ---
requestForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return showToast("Please login first", true);

    try {
        await addDoc(collection(db, "requests"), {
            title: document.getElementById('req-title').value,
            description: document.getElementById('req-desc').value,
            userId: user.uid,
            userEmail: user.email,
            createdAt: serverTimestamp()
        });
        requestForm.reset();
        showSection('feed');
        showToast("Request posted!");
    } catch (error) {
        showToast("Error posting request", true);
    }
});

// --- Real-time Feed Loading ---
function loadRequests() {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
    
    onSnapshot(q, (snapshot) => {
        document.getElementById('loading-spinner').classList.add('hidden');
        requestsContainer.innerHTML = '';
        
        if (snapshot.empty) {
            document.getElementById('empty-state').classList.remove('hidden');
            return;
        }

        document.getElementById('empty-state').classList.add('hidden');
        snapshot.forEach((doc) => {
            const data = doc.data();
            const card = document.createElement('div');
            card.className = 'request-card';
            card.innerHTML = `
                <h3>${data.title}</h3>
                <p>${data.description}</p>
                <div class="card-footer">
                    <span><i class="fa-regular fa-user"></i> ${data.userEmail.split('@')[0]}</span>
                    <span><i class="fa-regular fa-clock"></i> ${data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</span>
                </div>
            `;
            requestsContainer.appendChild(card);
        });
    });
}

// --- Helper: Toast Notification ---
function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    if (isError) toast.style.background = '#ef4444';
    toast.innerText = message;
    document.getElementById('toast-container').appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
