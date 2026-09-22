// Import Firebase SDKs from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGsVPoa-GdtvXy3iNRW1bln1c5GUuYPY",
  authDomain: "ohmies-db.firebaseapp.com",
  databaseURL: "https://ohmies-db-default-rtdb.firebaseio.com",
  projectId: "ohmies-db",
  storageBucket: "ohmies-db.appspot.com",
  messagingSenderId: "934302052206",
  appId: "1:934302052206:web:b4d2d52fd64626a7e45b7f"
};

// Initialize Firebase & Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements for Unity Board
const submitBtn = document.getElementById('submitUnityBtn');
const unityInput = document.getElementById('unityInput');
const unityFeed = document.getElementById('unityFeed');

// 1. Send message to Firebase when button is clicked
if (submitBtn) {
    submitBtn.addEventListener('click', () => {
        const message = unityInput.value.trim();
        
        if (message === "") {
            alert("Please write something before posting!");
            return;
        }

        const postsRef = ref(db, 'unityBoard');
        
        push(postsRef, {
            text: message,
            timestamp: Date.now()
        }).then(() => {
            unityInput.value = "";
        }).catch((error) => {
            console.error("Error posting message: ", error);
            alert("Failed to post. Check your connection!");
        });
    });
}

// 2. Real-time listener: Load and display posts automatically
const postsRef = ref(db, 'unityBoard');
onChildAdded(postsRef, (snapshot) => {
    const data = snapshot.val();
    
    const postCard = document.createElement('div');
    postCard.className = "bg-gray-50 p-4 rounded-lg border-l-4 border-green-600 shadow-sm mb-3";
    postCard.innerHTML = `
        <p class="text-gray-800">${data.text}</p>
        <span class="text-xs text-gray-400 mt-2 block">Anonymous SEES'30</span>
    `;

    if (unityFeed) {
        unityFeed.prepend(postCard);
    }
});// --- SUGGESTIONS / IMPROVEMENTS LOGIC ---

const submitSuggestionBtn = document.getElementById('submitSuggestionBtn');
const suggestionInput = document.getElementById('suggestionInput');
const suggestionFeed = document.getElementById('suggestionFeed');

// 1. Send suggestion to Firebase
if (submitSuggestionBtn) {
    submitSuggestionBtn.addEventListener('click', () => {
        const idea = suggestionInput.value.trim();
        
        if (idea === "") {
            alert("Please write a suggestion before submitting!");
            return;
        }

        const suggestionsRef = ref(db, 'suggestions');
        
        push(suggestionsRef, {
            text: idea,
            timestamp: Date.now()
        }).then(() => {
            suggestionInput.value = "";
            alert("Suggestion submitted successfully!");
        }).catch((error) => {
            console.error("Error submitting suggestion: ", error);
            alert("Failed to submit. Check your connection!");
        });
    });
}

// 2. Real-time listener: Load and display suggestions automatically
const suggestionsRef = ref(db, 'suggestions');
onChildAdded(suggestionsRef, (snapshot) => {
    const data = snapshot.val();
    
    const suggestionCard = document.createElement('div');
    suggestionCard.className = "bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600 shadow-sm mb-3";
    suggestionCard.innerHTML = `
        <p class="text-gray-800">${data.text}</p>
        <span class="text-xs text-gray-400 mt-2 block">SEES'30 Suggestion Box</span>
    `;

    if (suggestionFeed) {
        suggestionFeed.prepend(suggestionCard);
    }
});

