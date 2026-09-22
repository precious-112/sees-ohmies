// Import Firebase from the official web CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Your web app's Firebase configuration (Added the databaseURL!)
const firebaseConfig = {
  apiKey: "AIzaSyAGsVPoa-GdtvXy3iNRW1bln1c5GUuYPY",
  authDomain: "ohmies-db.firebaseapp.com",
  databaseURL: "https://ohmies-db-default-rtdb.firebaseio.com",
  projectId: "ohmies-db",
  storageBucket: "ohmies-db.appspot.com",
  messagingSenderId: "934302052206",
  appId: "1:934302052206:web:b4d2d52fd64626a7e45b7f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Initialize Firebase
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

        // Reference to the 'unityBoard' node in database
        const postsRef = ref(db, 'unityBoard');
        
        // Push the new message to Firebase cloud
        push(postsRef, {
            text: message,
            timestamp: Date.now()
        }).then(() => {
            // Clear input box on success
            unityInput.value = "";
        }).catch((error) => {
            console.error("Error posting message: ", error);
            alert("Failed to post. Check your connection!");
        });
    });
}

// 2. Real-time listener: Load and display posts automatically as they arrive
const postsRef = ref(db, 'unityBoard');
onChildAdded(postsRef, (snapshot) => {
    const data = snapshot.val();
    
    // Create a new post element
    const postCard = document.createElement('div');
    postCard.className = "bg-gray-50 p-4 rounded-lg border-l-4 border-green-600 shadow-sm mb-3";
    postCard.innerHTML = `
        <p class="text-gray-800">${data.text}</p>
        <span class="text-xs text-gray-400 mt-2 block">Anonymous SEES'30</span>
    `;

    // Add it to the top of the feed if the feed container exists
    if (unityFeed) {
        unityFeed.prepend(postCard);
    }
});