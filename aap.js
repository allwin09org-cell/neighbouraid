// 🔥 PASTE YOUR FIREBASE CONFIG HERE 🔥
// ======================================
const firebaseConfig = {
  // REPLACE WITH YOUR CONFIG FROM FIREBASE CONSOLE
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "123456789",
  appId: "YOUR_APP_ID"
};
// ======================================

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, orderBy, query, limit } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const loadingOverlay = document.getElementById('loadingOverlay');
const authSection = document.getElementById('authSection');
const dashboard = document.getElementById('dashboard');
const authForm = document.getElementById('authForm');
const authBtn = document.getElementById('authBtn');
const toggleAuth = document.getElementById('toggleAuth');
const toggleText = document.getElementById('toggleText');
const authMessage = document.getElementById('authMessage');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const userEmail = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');
const requestInput = document.getElementById('requestInput');
const postRequestBtn = document.getElementById('postRequestBtn');
const requestsList = document.getElementById('requestsList');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const messagesList = document.getElementById('messagesList');

// App State
let currentUser = null;
let isSignUp = false;

// Utility Functions
const showMessage = (text, type = 'error') => {
    authMessage.textContent = text;
    authMessage.className = `message ${type}`;
    authMessage.classList.remove('hidden');
    
    setTimeout(() => {
        authMessage.classList.add('hidden');
    }, 5000);
};

const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' • ' +
           date.to
