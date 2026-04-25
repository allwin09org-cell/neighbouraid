import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- REPLACE THIS WITH YOUR FIREBASE CONFIG ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
let authMode = 'login';

// --- Auth Handling ---
const authForm = document.getElementById('auth-form');
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-password').value;

    try {
        if (authMode === 'signup') {
            await createUserWithEmailAndPassword(auth, email, pass);
            showToast("Account created successfully!");
        } else {
            await signInWithEmailAndPassword(auth, email, pass);
            showToast("Welcome back!");
        }
        document.getElementById('auth-modal').style.display = 'none';
    } catch (err) {
        showToast(err.message, "error");
    }
});

onAuthStateChanged(auth, (user) => {
    currentUser = user;
    const authBtnContainer = document.getElementById('auth-btn-container');
    const dashboard = document.getElementById('dashboard');
    
    if (user) {
        authBtnContainer.innerHTML = `<button class="btn-outline" id="logout-btn">Logout (${user.email.split('@')[0]})</button>`;
        dashboard.style.display = 'block';
        document.getElementById('logout-btn').onclick = () => signOut(auth);
    } else {
        authBtnContainer.innerHTML = `<button class="btn-primary" onclick="toggleModal('auth-modal')">Login / Sign Up</button>`;
        dashboard.style.display = 'none';
    }
});

// --- Help Requests Logic ---
const requestForm = document.getElementById('request-form');
requestForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = document.getElementById('req-text').value;
    try {
        await addDoc(collection(db, "requests"), {
            text,
            user: currentUser.email,
            createdAt: serverTimestamp()
        });
        document.getElementById('request-modal').style.display = 'none';
        requestForm.reset();
    } catch (err) { showToast("Error posting request", "error"); }
});

// Live Listen Requests
const qReq = query(collection(db, "requests"), orderBy("createdAt", "desc"));
onSnapshot(qReq, (snapshot) => {
    const container = document.getElementById('requests-container');
    if (snapshot.empty) {
        container.innerHTML = "<p class='no-data'>No requests available yet. Be the first!</p>";
        return;
    }
    container.innerHTML = "";
    snapshot.forEach(doc => {
        const data = doc.data();
        container.innerHTML += `
            <div class="card">
                <span class="user-email">${data.user}</span>
                <p>${data.text}</p>
                <span class="time">${data.createdAt?.toDate().toLocaleString() || 'Just now'}</span>
            </div>
        `;
    });
});

// --- Chat Logic ---
const chatForm = document.getElementById('chat-form');
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('chat-input').value;
    try {
        await addDoc(collection(db, "messages"), {
            text: msg,
            user: currentUser.email,
            createdAt: serverTimestamp()
        });
        chatForm.reset();
    } catch (err) { console.error(err); }
});

// Live Listen Chat
const qChat = query(collection(db, "messages"), orderBy("createdAt", "asc"));
onSnapshot(qChat, (snapshot) => {
    const chatBox = document.getElementById('chat-messages');
    chatBox.innerHTML = "";
    snapshot.forEach(doc => {
        const data = doc.data();
        const isMe = data.user === currentUser?.email;
        chatBox.innerHTML += `
            <div class="msg ${isMe ? 'sent' : 'received'}">
                <span class="msg-info">${data.user.split('@')[0]}</span>
                ${data.text}
            </div>
        `;
    });
    chatBox.scrollTop = chatBox.scrollHeight;
});

// --- UI Utilities ---
window.switchAuthMode = (mode) => {
    authMode = mode;
    document.getElementById('login-tab').classList.toggle('active', mode === 'login');
    document.getElementById('signup-tab').classList.toggle('active', mode === 'signup');
    document.getElementById('auth-submit-btn').innerText = mode === 'login' ? 'Login' : 'Create Account';
};

function showToast(msg, type = "success") {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = msg;
    document.getElementById('toast-container').appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}