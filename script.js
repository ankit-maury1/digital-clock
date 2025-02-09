class Clock {
    constructor() {
        this.hoursHand = document.querySelector('.hours-hand');
        this.minutesHand = document.querySelector('.minutes-hand');
        this.secondsHand = document.querySelector('.seconds-hand');
        this.amPmIndicator = document.querySelector('.am-pm-indicator');
        
        this.init();
    }

    init() {
        // Initial update
        this.updateClock();
        
        // Start the animation loop
        requestAnimationFrame(() => this.animate());
    }

    updateClock() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();

        // Calculate precise angles for smooth movement
        const hoursAngle = (hours % 12 + minutes / 60) * 30;
        const minutesAngle = (minutes + seconds / 60) * 6;
        const secondsAngle = (seconds + milliseconds / 1000) * 6;

        // Apply rotations
        this.hoursHand.style.transform = `rotate(${hoursAngle}deg)`;
        this.minutesHand.style.transform = `rotate(${minutesAngle}deg)`;
        this.secondsHand.style.transform = `rotate(${secondsAngle}deg)`;

        // Update AM/PM indicator
        const isAM = hours < 12;
        this.amPmIndicator.textContent = isAM ? 'AM' : 'PM';
        this.amPmIndicator.classList.add('visible');

        // Update indicator visibility
        if (!this.amPmIndicator.classList.contains('visible')) {
            this.amPmIndicator.classList.add('visible');
        }
    }

    animate() {
        this.updateClock();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the clock when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new Clock();
});
