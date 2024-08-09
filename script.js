const socket = io();

document.getElementById('sendBtn').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    const message = document.getElementById('message').value.trim();

    if (username && message) {
        socket.emit('chatMessage', { username, message });
        document.getElementById('message').value = '';
    }
});

socket.on('message', data => {
    const chatWindow = document.getElementById('chat-window');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message');
    messageDiv.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
});
