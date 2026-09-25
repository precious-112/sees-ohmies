function switchScreen(targetScreenId) {
    // 1. Grab all three screens
    const lobby = document.getElementById('lobby-screen');
    const chat = document.getElementById('chat-screen');
    const host = document.getElementById('host-screen');

    // 2. Hide all screens by adding the 'hidden' class and removing 'flex'
    lobby.classList.add('hidden');
    
    chat.classList.add('hidden');
    chat.classList.remove('flex'); // Chat uses flexbox, so we must remove it when hiding
    
    host.classList.add('hidden');

    // 3. Show the requested screen
    const target = document.getElementById(targetScreenId);
    target.classList.remove('hidden');
    
    // If the target is the chat screen, add 'flex' back so the layout works
    if (targetScreenId === 'chat-screen') {
        target.classList.add('flex');
    }
}