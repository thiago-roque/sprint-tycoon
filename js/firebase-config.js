import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, update, runTransaction, onValue, get } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD79HMQBPz0v8wK2KfwI_nrNzEjmhjqS0U",
    authDomain: "sprinttycoon-treino.firebaseapp.com",
    databaseURL: "https://sprinttycoon-treino-default-rtdb.firebaseio.com",
    projectId: "sprinttycoon-treino",
    storageBucket: "sprinttycoon-treino.firebasestorage.app",
    messagingSenderId: "23600382558",
    appId: "1:23600382558:web:f6a1cba74c78fd38e8aacf"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, update, runTransaction, onValue, get };