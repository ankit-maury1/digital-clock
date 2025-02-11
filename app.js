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
        this.chatButton.addEventListener('click', () => this.toggleChat(true));
        this.closeChat.addEventListener('click', () => this.toggleChat(false));
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        this.voiceButton.addEventListener('click', () => this.toggleVoiceInput());
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

        // Add user message
        this.addMessage(content, 'user');
        this.messageInput.value = '';

        // Show typing indicator
        this.typingIndicator.classList.remove('hidden');

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Bot response
        const botResponse = `Thanks for your message: "${content}"`;
        this.typingIndicator.classList.add('hidden');
        this.addMessage(botResponse, 'bot');
        
        // Speak bot response
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
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    speakMessage(text: string) {
    if ('speechSynthesis' in window && !this.isSpeaking) {
        const utterance = new SpeechSynthesisUtterance(text);

        // Choose a better voice
        const voices = speechSynthesis.getVoices();
        utterance.voice = voices.find(voice => voice.lang.includes('en-US')) || voices[0];

        // Adjust voice parameters for better clarity
        utterance.pitch = 1.2;  // Adjust pitch (1 is normal, higher is sharper)
        utterance.rate = 0.95;   // Slow down the speech slightly
        utterance.volume = 1.0;  // Max volume for clear speech

        // Set event listeners to track speech status
        utterance.onstart = () => {
            this.isSpeaking = true;
        };
        utterance.onend = () => {
            this.isSpeaking = false;
        };

        // Speak the message
        speechSynthesis.speak(utterance);
    }
}

}

// Initialize the chat app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});
