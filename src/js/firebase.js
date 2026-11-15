import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCZaL2KTFxwASr_cYOGayL23HEURT9L7IE",
  authDomain: "maxgfortess.firebaseapp.com",
  projectId: "maxgfortess",
  storageBucket: "maxgfortess.firebasestorage.app",
  messagingSenderId: "631904884879",
  appId: "1:631904884879:web:e136878d9233c52e62f8fa",
  measurementId: "G-N0SC30CT07"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };