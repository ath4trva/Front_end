// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "rideo.firebaseapp.com",
  projectId: "rideor91c1",
  storageBucket: "-991c1.appspot.com",
  messagingSenderId: "",
  appId: "1:1014763811457:web:",
  measurementId: "G-"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to save user to Firestore
async function saveUserToFirestore(userId, firstname, email) {
  try {
    await setDoc(doc(db, "users", userId), {
      firstname: firstname,
      email: email,
    });
    console.log("User data saved to Firestore.");
  } catch (error) {
    console.error("Error saving user data:", error);
  }
}

// Handle form submission for both login/signup
const form = document.getElementById("form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = event.target.email.value;
  const password = event.target.password.value;
  const firstname = event.target.firstname?.value || "";

  if (window.location.pathname.includes("signup")) {
    // Signup logic
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await saveUserToFirestore(userCredential.user.uid, firstname, email);
      window.location.href = "login.html"; // Redirect to login after successful signup
    } catch (error) {
      document.getElementById("error-message").innerText = error.message;
    }
  } else if (window.location.pathname.includes("login")) {
    // Login logic
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "pref.html"; // Redirect to dashboard after successful login
    } catch (error) {
      document.getElementById("error-message").innerText = error.message;
    }
  }
});
