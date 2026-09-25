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

// --- ANONYMOUS CLINIC / FEEDBACK THURSDAY LOGIC ---

const submitClinicBtn = document.getElementById('submitClinicBtn');
const clinicInput = document.getElementById('clinicInput');
const clinicFeed = document.getElementById('clinicFeed');
const generateSessionBtn = document.getElementById('generateSessionBtn');
const generatedLinkContainer = document.getElementById('generatedLinkContainer');
const shareableLinkInput = document.getElementById('shareableLinkInput');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const sessionTitleDisplay = document.getElementById('sessionTitleDisplay');

// 1. Detect if a unique session is specified in the URL
const urlParams = new URLSearchParams(window.location.search);
const currentSessionId = urlParams.get('session') || 'general-clinic';

if (urlParams.get('session')) {
    sessionTitleDisplay.textContent = `Active Session: Feedback Thursday (${urlParams.get('session').slice(0, 8)})`;
    switchScreen('lobby-screen');
}

// 2. Organizer: Generate unique link
if (generateSessionBtn) {
    generateSessionBtn.addEventListener('click', () => {
        const uniqueId = 'thursday_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
        const fullLink = `${window.location.origin}${window.location.pathname}?session=${uniqueId}`;
        
        shareableLinkInput.value = fullLink;
        generatedLinkContainer.classList.remove('hidden');
    });
}

// 3. Copy link button
if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
        shareableLinkInput.select();
        navigator.clipboard.writeText(shareableLinkInput.value);
        alert("Feedback Thursday link copied to clipboard! Drop it in the class group.");
    });
}

// 4. Submit secure feedback to the specific session node in Firebase
if (submitClinicBtn) {
    submitClinicBtn.addEventListener('click', () => {
        const message = clinicInput.value.trim();
        
        if (message === "") {
            alert("Please type a message before submitting.");
            return;
        }

        const sessionRef = ref(db, `clinicSessions/${currentSessionId}/feedbacks`);
        
        push(sessionRef, {
            text: message,
            timestamp: Date.now()
        }).then(() => {
            clinicInput.value = "";
            alert("Feedback submitted anonymously and securely!");
        }).catch((error) => {
            console.error("Error submitting feedback: ", error);
            alert("Failed to submit. Check your connection!");
        });
    });
}

// 5. Real-time listener for this specific session's feedback
const activeSessionRef = ref(db, `clinicSessions/${currentSessionId}/feedbacks`);
onChildAdded(activeSessionRef, (snapshot) => {
    const data = snapshot.val();
    
    const card = document.createElement('div');
    card.className = "bg-gray-800 p-3 rounded-lg border-l-4 border-green-500 text-xs shadow-sm mb-2";
    card.innerHTML = `
        <p class="text-gray-200">${data.text}</p>
        <span class="text-[10px] text-gray-500 mt-1 block">Anonymous SEES'30 Member</span>
    `;

    if (clinicFeed) {
        clinicFeed.prepend(card);
    }
});

// --- ADMIN PASSCODE SECURITY LOGIC ---
const ADMIN_PIN = "3030"; // You can change this PIN to whatever you prefer!
const adminLockContainer = document.getElementById('adminLockContainer');
const organizerToolsContent = document.getElementById('organizerToolsContent');
const adminPinInput = document.getElementById('adminPinInput');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const lockAdminBtn = document.getElementById('lockAdminBtn');

// Remember unlock state during your browser session
if (sessionStorage.getItem('sees_admin_unlocked') === 'true') {
    if (adminLockContainer) adminLockContainer.classList.add('hidden');
    if (organizerToolsContent) organizerToolsContent.classList.remove('hidden');
}

if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', () => {
        if (adminPinInput && adminPinInput.value === ADMIN_PIN) {
            sessionStorage.setItem('sees_admin_unlocked', 'true');
            adminLockContainer.classList.add('hidden');
            organizerToolsContent.classList.remove('hidden');
            adminPinInput.value = '';
        } else {
            alert("Incorrect Admin PIN!");
            if (adminPinInput) adminPinInput.value = '';
        }
    });
}

if (lockAdminBtn) {
    lockAdminBtn.addEventListener('click', () => {
        sessionStorage.removeItem('sees_admin_unlocked');
        organizerToolsContent.classList.add('hidden');
        adminLockContainer.classList.remove('hidden');
    });
}