// 🔥 IMPORT FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔑 PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  ...
};
// INIT
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM
const authSection = document.getElementById("auth-section");
const dashboard = document.getElementById("dashboard");
const userEmail = document.getElementById("userEmail");

// AUTH FUNCTIONS
window.signup = async () => {
  const email = emailInput();
  const pass = passwordInput();
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    alert("Signup successful!");
  } catch (err) {
    alert(err.message);
  }
};

window.login = async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput(), passwordInput());
  } catch (err) {
    alert(err.message);
  }
};

window.logout = () => signOut(auth);

function emailInput() {
  return document.getElementById("email").value;
}
function passwordInput() {
  return document.getElementById("password").value;
}

// AUTH STATE
onAuthStateChanged(auth, (user) => {
  if (user) {
    authSection.classList.add("hidden");
    dashboard.classList.remove("hidden");
    userEmail.innerText = user.email;
    loadRequests();
    loadChat();
  } else {
    authSection.classList.remove("hidden");
    dashboard.classList.add("hidden");
  }
});

// HELP REQUESTS
window.postRequest = async () => {
  const text = document.getElementById("requestInput").value;
  if (!text) return alert("Enter request");

  await addDoc(collection(db, "requests"), {
    text,
    user: auth.currentUser.email,
    createdAt: serverTimestamp()
  });

  document.getElementById("requestInput").value = "";
};

function loadRequests() {
  const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snapshot) => {
    const list = document.getElementById("requestsList");
    list.innerHTML = "";

    if (snapshot.empty) {
      list.innerHTML = "<p>No requests yet</p>";
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      list.innerHTML += `
        <div class="card">
          <p>${data.text}</p>
          <small>${data.user}</small>
        </div>
      `;
    });
  });
}

// CHAT
window.sendMessage = async () => {
  const input = document.getElementById("chatInput");
  if (!input.value) return;

  await addDoc(collection(db, "messages"), {
    text: input.value,
    user: auth.currentUser.email,
    createdAt: serverTimestamp()
  });

  input.value = "";
};

function loadChat() {
  const q = query(collection(db, "messages"), orderBy("createdAt"));
  onSnapshot(q, (snapshot) => {
    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = "";

    snapshot.forEach(doc => {
      const msg = doc.data();
      chatBox.innerHTML += `
        <p><strong>${msg.user}:</strong> ${msg.text}</p>
      `;
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  });
}
