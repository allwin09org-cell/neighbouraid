// 🔥 PASTE YOUR FIREBASE CONFIG HERE 🔥
// ======================================
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaoCqAF7s4JiOm8-rfmlkF65VJEwDA8g0",
  authDomain: "neighbor-aid-ac5a8.firebaseapp.com",
  databaseURL: "https://neighbor-aid-ac5a8-default-rtdb.firebaseio.com",
  projectId: "neighbor-aid-ac5a8",
  storageBucket: "neighbor-aid-ac5a8.firebasestorage.app",
  messagingSenderId: "395359721520",
  appId: "1:395359721520:web:4f0741c3b884243a9cb5f5",
  measurementId: "G-EFYSPF0MGQ"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
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
