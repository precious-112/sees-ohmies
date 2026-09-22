// Function to switch between screens
function switchScreen(targetScreenId) {
    // Hide all main containers
    const screens = ['hub-screen', 'lobby-screen', 'chat-screen', 'news-screen', 'unity-screen', 'suggestion-screen'];
    
    screens.forEach(screenId => {
        const el = document.getElementById(screenId);
        if (el) {
            el.classList.add('hidden');
            el.classList.remove('flex');
        }
    });

    // Show the target screen
    const target = document.getElementById(targetScreenId);
    if (target) {
        target.classList.remove('hidden');
        // If it's the chat screen, it requires flexbox display
        if (targetScreenId === 'chat-screen') {
            target.classList.add('flex');
        }
    }
}

// Function to handle sending a message in the chat
function sendMessage() {
    const inputField = document.getElementById('chat-input');
    const messageText = inputField.value.trim();
    
    if (messageText === '') return;

    const chatBox = document.getElementById('chat-messages');

    // Create message bubble
    const messageBubble = document.createElement('div');
    messageBubble.className = "self-end bg-green-600 text-white p-3 rounded-lg shadow-sm rounded-tr-none max-w-[80%]";
    messageBubble.innerHTML = `<p class="text-sm">${messageText}</p>`;

    chatBox.appendChild(messageBubble);
    inputField.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
}
// Unity Board local handling
const submitBtn = document.getElementById('submitUnityBtn');
const unityInput = document.getElementById('unityInput');
const unityFeed = document.getElementById('unityFeed');

if (submitBtn) {
    submitBtn.addEventListener('click', () => {
        const message = unityInput.value.trim();
        
        if (message === "") {
            alert("Please write something before posting!");
            return;
        }

        // Create a new post element
        const postCard = document.createElement('div');
        postCard.className = "bg-gray-50 p-4 rounded-lg border-l-4 border-green-600 shadow-sm";
        postCard.innerHTML = `
            <p class="text-gray-800">${message}</p>
            <span class="text-xs text-gray-400 mt-2 block">Just now • Anonymous SEES'30</span>
        `;

        // Add it to the top of the feed
        unityFeed.prepend(postCard);

        // Clear the input box
        unityInput.value = "";
    });
}