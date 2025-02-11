class ChatApp {
    constructor() {
        this.chatButton = document.getElementById('chatButton');
        this.chatWindow = document.getElementById('chatWindow');
        this.closeChat = document.getElementById('closeChat');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendMessage');
        this.messagesContainer = document.getElementById('chatMessages');
        this.voiceButton = document.getElementById('voiceInput');
        this.typingIndicator = document.getElementById('typingIndicator');

        this.recognition = null;
        this.isListening = false;
        this.isSpeaking = false;

        this.initializeEventListeners();
        this.setupSpeechRecognition();
    }

    initializeEventListeners() {
        const events = ['click', 'touchstart']; // Support both click & touch for mobile
        events.forEach(event => {
            this.chatButton.addEventListener(event, () => this.toggleChat(true));
            this.closeChat.addEventListener(event, () => this.toggleChat(false));
            this.sendButton.addEventListener(event, () => this.sendMessage());
            this.voiceButton.addEventListener(event, () => this.toggleVoiceInput());
        });

        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.messageInput.value = transcript;
                this.isListening = false;
                this.voiceButton.classList.remove('active');
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.voiceButton.classList.remove('active');
            };
        } else {
            console.warn("Speech recognition not supported on this device.");
            this.voiceButton.style.display = "none"; // Hide button if not supported
        }
    }

    toggleChat(show) {
        this.chatWindow.classList.toggle('hidden', !show);
        if (show) {
            setTimeout(() => this.chatWindow.classList.add('visible'), 10);
        } else {
            this.chatWindow.classList.remove('visible');
        }
    }

    toggleVoiceInput() {
        if (!this.recognition) {
            console.error('Speech recognition not supported');
            return;
        }
        if (this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            this.voiceButton.classList.remove('active');
        } else {
            this.recognition.start();
            this.isListening = true;
            this.voiceButton.classList.add('active');
        }
    }

    async sendMessage() {
        const content = this.messageInput.value.trim();
        if (!content) return;

        this.addMessage(content, 'user');
        this.messageInput.value = '';

        this.typingIndicator.classList.remove('hidden');

        await new Promise(resolve => setTimeout(resolve, 1500));

        const botResponse = `Thanks for your message: "${content}"`;
        this.typingIndicator.classList.add('hidden');
        this.addMessage(botResponse, 'bot');

        this.speakMessage(botResponse);
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const contentP = document.createElement('p');
        contentP.className = 'content';
        contentP.textContent = content;

        const timeSpan = document.createElement('span');
        timeSpan.className = 'timestamp';
        timeSpan.textContent = new Date().toLocaleTimeString();

        messageDiv.appendChild(contentP);
        messageDiv.appendChild(timeSpan);

        if (sender === 'bot') {
            const soundButton = document.createElement('button');
            soundButton.className = 'sound-button';
            soundButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
            `;
            soundButton.onclick = () => this.speakMessage(content);
            messageDiv.appendChild(soundButton);
        }

        this.messagesContainer.appendChild(messageDiv);

        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    speakMessage(text) {
        if ('speechSynthesis' in window && !this.isSpeaking) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onstart = () => {
                this.isSpeaking = true;
            };
            utterance.onend = () => {
                this.isSpeaking = false;
            };

            if (document.hasFocus()) {
                speechSynthesis.speak(utterance);
            } else {
                console.warn("Speech synthesis blocked until user interaction.");
            }
        }
    }
}

// Initialize the chat app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});
