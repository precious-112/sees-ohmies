// Import Firebase SDKs from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, get, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

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

// --- ALL DOM ELEMENTS ---
const submitBtn = document.getElementById('submitUnityBtn');
const unityInput = document.getElementById('unityInput');
const unityFeed = document.getElementById('unityFeed');

const submitClinicBtn = document.getElementById('submitClinicBtn');
const clinicInput = document.getElementById('clinicInput');
const clinicFeed = document.getElementById('clinicFeed');
const generateSessionBtn = document.getElementById('generateSessionBtn');
const generatedLinkContainer = document.getElementById('generatedLinkContainer');
const shareableLinkInput = document.getElementById('shareableLinkInput');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const sessionTitleDisplay = document.getElementById('sessionTitleDisplay');

const adminLockContainer = document.getElementById('adminLockContainer');
const organizerToolsContent = document.getElementById('organizerToolsContent');
const adminPinInput = document.getElementById('adminPinInput');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const lockAdminBtn = document.getElementById('lockAdminBtn');

const exportFeedbackBtn = document.getElementById('exportFeedbackBtn');

// --- AUTOMATED PROFANITY FILTER ---
const blockedWords = ['fuck', 'shit', 'bitch', 'asshole', 'stupid', 'idiot']; 

function censorText(text) {
    let safeText = text;
    blockedWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        safeText = safeText.replace(regex, '***');
    });
    return safeText;
}

// 1. Detect if a unique session is specified in the URL
const urlParams = new URLSearchParams(window.location.search);
const currentSessionId = urlParams.get('session') || 'general-clinic';

if (urlParams.get('session')) {
    if (sessionTitleDisplay) sessionTitleDisplay.textContent = `Active Session: Feedback Thursday (${urlParams.get('session').slice(0, 8)})`;
    if (typeof switchScreen === 'function') switchScreen('lobby-screen');
}

// --- UNITY BOARD LOGIC ---
if (submitBtn) {
    submitBtn.addEventListener('click', () => {
        const message = unityInput.value.trim();
        
        if (message === "") {
            alert("Please write something before posting!");
            return;
        }

        const postsRef = ref(db, 'unityBoard');
        
        push(postsRef, {
            text: censorText(message), 
            timestamp: Date.now()
        }).then(() => {
            unityInput.value = "";
        }).catch((error) => {
            console.error("Error posting message: ", error);
            alert("Failed to post. Check your connection!");
        });
    });
}

const displayPostsRef = ref(db, 'unityBoard');
onChildAdded(displayPostsRef, (snapshot) => {
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
});

// --- ANONYMOUS CLINIC LOGIC ---
if (generateSessionBtn) {
    generateSessionBtn.addEventListener('click', () => {
        const uniqueId = 'thursday_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
        const fullLink = `${window.location.origin}${window.location.pathname}?session=${uniqueId}`;
        
        shareableLinkInput.value = fullLink;
        generatedLinkContainer.classList.remove('hidden');
    });
}

if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
        shareableLinkInput.select();
        navigator.clipboard.writeText(shareableLinkInput.value);
        alert("Feedback Thursday link copied to clipboard! Drop it in the class group.");
    });
}

if (submitClinicBtn) {
    submitClinicBtn.addEventListener('click', () => {
        const message = clinicInput.value.trim();
        
        if (message === "") {
            alert("Please type a message before submitting.");
            return;
        }

        if (message.length < 3) {
            alert("Your message is too short. Please provide a bit more detail.");
            return;
        }

        const lastSubmitted = localStorage.getItem('last_clinic_submission') || 0;
        const now = Date.now();
        if (now - lastSubmitted < 5000) { 
            alert("Please wait a few seconds before sending another message.");
            return;
        }

        const sessionRef = ref(db, `clinicSessions/${currentSessionId}/feedbacks`);
        
        push(sessionRef, {
            text: censorText(message),
            timestamp: Date.now()
        }).then(() => {
            clinicInput.value = "";
            localStorage.setItem('last_clinic_submission', Date.now());
            alert("Feedback submitted anonymously and securely!");
        }).catch((error) => {
            console.error("Error submitting feedback: ", error);
            alert("Failed to submit. Check your connection!");
        });
    });
}

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

// --- ADMIN PASSCODE SECURITY ---
const ADMIN_PIN = "3030"; 

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

// --- EXPORT SESSION FEEDBACK ---
if (exportFeedbackBtn) {
    exportFeedbackBtn.addEventListener('click', () => {
        const sessionRef = ref(db, `clinicSessions/${currentSessionId}/feedbacks`);
        
        get(sessionRef).then((snapshot) => {
            if (!snapshot.exists()) {
                alert("No feedback found for this session yet!");
                return;
            }

            let fileContent = `=== SEES'30 FEEDBACK THURSDAY EXPORT ===\n`;
            fileContent += `Session ID: ${currentSessionId}\n`;
            fileContent += `Exported: ${new Date().toLocaleString()}\n`;
            fileContent += `----------------------------------------\n\n`;

            let count = 1;
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                const timeStr = new Date(data.timestamp).toLocaleString();
                fileContent += `[${count}] Time: ${timeStr}\n`;
                fileContent += `Message: ${data.text}\n`;
                fileContent += `----------------------------------------\n`;
                count++;
            });

            const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Feedback_Thursday_${currentSessionId.slice(0, 8)}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }).catch((error) => {
            console.error("Export error:", error);
            alert("Failed to export feedback. Check your connection!");
        });
    });
}

// --- OFFLINE / ONLINE NETWORK LISTENER ---
const offlineBanner = document.getElementById('offlineBanner');

window.addEventListener('offline', () => {
    if (offlineBanner) {
        offlineBanner.classList.remove('hidden');
    }
});

window.addEventListener('online', () => {
    if (offlineBanner) {
        offlineBanner.classList.add('hidden');
    }
});

// --- IMPROVEMENTS / SUGGESTION BOX LOGIC ---
const submitSuggestionBtn = document.getElementById('submitSuggestionBtn');
const suggestionInput = document.getElementById('suggestionInput');
const suggestionFeed = document.getElementById('suggestionFeed');

if (submitSuggestionBtn) {
    submitSuggestionBtn.addEventListener('click', () => {
        const message = suggestionInput.value.trim();
        
        if (message === "") {
            alert("Please write an idea before submitting!");
            return;
        }

        const ideasRef = ref(db, 'suggestions');
        
        push(ideasRef, {
            text: censorText(message), 
            upvotes: 0, 
            timestamp: Date.now()
        }).then(() => {
            suggestionInput.value = "";
            alert("Awesome! Your idea has been dropped securely.");
        }).catch((error) => {
            console.error("Error submitting idea:", error);
            alert("Failed to submit. Check your connection!");
        });
    });
}

const ideasRef = ref(db, 'suggestions');
onChildAdded(ideasRef, (snapshot) => {
    const data = snapshot.val();
    const ideaKey = snapshot.key; 
    let currentVotes = data.upvotes || 0;
    
    const card = document.createElement('div');
    card.className = "bg-gray-50 p-3 rounded-lg border-l-4 border-green-600 shadow-sm mb-2 flex justify-between items-start gap-3";
    
    card.innerHTML = `
        <p class="text-sm text-gray-800 flex-1">${data.text}</p>
        <button class="upvote-btn flex items-center gap-1 bg-white border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 px-2 py-1 rounded text-xs transition-colors shadow-sm">
            <span>❤️</span> <span class="vote-count font-bold">${currentVotes}</span>
        </button>
    `;
    
    const upvoteBtn = card.querySelector('.upvote-btn');
    const voteCountSpan = card.querySelector('.vote-count');
    
    upvoteBtn.addEventListener('click', () => {
        upvoteBtn.disabled = true; 
        currentVotes += 1;
        voteCountSpan.innerText = currentVotes;
        
        const specificIdeaRef = ref(db, `suggestions/${ideaKey}`);
        update(specificIdeaRef, {
            upvotes: currentVotes
        }).then(() => {
            upvoteBtn.classList.add('text-red-500', 'border-red-200', 'bg-red-50');
        });
    });

    if (suggestionFeed) {
        suggestionFeed.prepend(card);
    }
});

// --- ADMIN NOTICEBOARD BROADCASTER ---
const postNoticeBtn = document.getElementById('postNoticeBtn');
const adminNoticeInput = document.getElementById('adminNoticeInput');
const noticeFeed = document.getElementById('noticeFeed'); 

if (postNoticeBtn) {
    postNoticeBtn.addEventListener('click', () => {
        const text = adminNoticeInput.value.trim();
        if (text === "") {
            alert("Write an announcement first!");
            return;
        }

        const noticesRef = ref(db, 'announcements');
        push(noticesRef, {
            message: text,
            timestamp: Date.now()
        }).then(() => {
            adminNoticeInput.value = "";
            alert("Announcement broadcasted successfully!");
        });
    });
}

const noticesRef = ref(db, 'announcements');
onChildAdded(noticesRef, (snapshot) => {
    const data = snapshot.val();
    
    const noticeCard = document.createElement('div');
    noticeCard.className = "bg-blue-50 border-l-4 border-blue-600 p-3 mb-3 rounded shadow-sm text-left";
    noticeCard.innerHTML = `
        <p class="text-sm text-gray-800 font-medium">${data.message}</p>
        <span class="text-[10px] text-gray-500 mt-1 block">Official Update • ${new Date(data.timestamp).toLocaleDateString()}</span>
    `;
    
    if (noticeFeed) {
        noticeFeed.prepend(noticeCard);
    }
});