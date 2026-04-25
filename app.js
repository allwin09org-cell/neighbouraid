import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, addDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 YOUR CONFIG HERE
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Signup
window.signup = function () {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, pass)
    .then(() => alert("User Created"))
    .catch(err => alert(err.message));
};

// Login
window.login = function () {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, pass)
    .then(() => {
      alert("Logged in");
      loadRequests();
    })
    .catch(err => alert(err.message));
};

// Add request
window.addRequest = async function () {
  const text = document.getElementById("helpText").value;

  await addDoc(collection(db, "requests"), {
    text: text,
    time: new Date()
  });

  alert("Posted!");
  loadRequests();
};

// Load requests
async function loadRequests() {
  const querySnapshot = await getDocs(collection(db, "requests"));
  const list = document.getElementById("list");
  list.innerHTML = "";

  querySnapshot.forEach(doc => {
    const li = document.createElement("li");
    li.innerText = doc.data().text;
    list.appendChild(li);
  });
}