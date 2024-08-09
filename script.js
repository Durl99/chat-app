const socket = io();
let username = '';
let currentSession = null;
let sessions = [];

// Función para crear una nueva sesión de chat
function createNewSession() {
    const newSessionId = `session-${Math.random().toString(36).substr(2, 9)}`;
    sessions.push(newSessionId);
    renderSessionList();
    socket.emit('createSession', newSessionId);
}

// Función para renderizar la lista de sesiones
function renderSessionList() {
    const sessionListHtml = sessions.map(sessionId => {
        return `<li data-session-id="${sessionId}">${sessionId}</li>`;
    }).join('');
    document.getElementById('session-list').innerHTML = `
        <ul>
            ${sessionListHtml}
        </ul>
    `;
}

// Función para manejar el evento de click en una sesión
document.getElementById('session-list').addEventListener('click', event => {
    if (event.target.tagName === 'LI') {
        const sessionId = event.target.getAttribute('data-session-id');
        currentSession = sessionId;
        socket.emit('joinSession', sessionId);
        renderChatWindow();
    }
});

// Función para renderizar la ventana de chat
function renderChatWindow(messages = []) {
    const chatWindowHtml = messages.map(message => {
        return `<div class="chat-message"><strong>${message.username}:</strong> ${message.message}</div>`;
    }).join('');
    document.getElementById('chat-window').innerHTML = chatWindowHtml;
    document.getElementById('chat-window').scrollTop = document.getElementById('chat-window').scrollHeight;
}

// Función para manejar el evento de envío de mensaje
document.getElementById('sendBtn').addEventListener('click', () => {
    const message = document.getElementById('message').value.trim();
    if (message !== '') {
        socket.emit('sendMessage', currentSession, username, message);
        document.getElementById('message').value = '';
    }
});

// Función para manejar el evento de creación de nueva sesión
document.getElementById('newSessionBtn').addEventListener('click', createNewSession);

// Función para establecer el nombre de usuario
document.getElementById('username').addEventListener('input', event => {
    username = event.target.value.trim();
});

// Conectar al servidor de socket.io
socket.on('connect', () => {
    console.log('Connected to server');
});

// Manejar la recepción de mensajes
socket.on('chatMessage', data => {
    if (currentSession) {
        const chatWindow = document.getElementById('chat-window');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message');
        messageDiv.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
});

// Manejar la recepción de sesiones existentes
socket.on('sessionList', sessionList => {
    sessions = sessionList;
    renderSessionList();
});
