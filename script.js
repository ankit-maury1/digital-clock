class Clock {
    constructor() {
        this.hourHand = document.querySelector('.hour-hand');
        this.minuteHand = document.querySelector('.minute-hand');
        this.secondHand = document.querySelector('.second-hand');
        this.hourValue = document.querySelector('.hours .value');
        this.minuteValue = document.querySelector('.minutes .value');
        this.secondValue = document.querySelector('.seconds .value');
        this.periodElement = document.querySelector('.period');

        this.updateClock();
        setInterval(() => this.updateClock(), 1000);

        // Prevent screen from sleeping in standalone mode
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.keepAwake();
        }
    }

    updateClock() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        // Update digital values
        this.hourValue.textContent = this.formatHour(hours);
        this.minuteValue.textContent = this.padNumber(minutes);
        this.secondValue.textContent = this.padNumber(seconds);

        // Update hands rotation
        const hourDegrees = ((hours % 12) * 30) + (minutes / 2);
        const minuteDegrees = minutes * 6;
        const secondDegrees = seconds * 6;

        this.hourHand.style.transform = `rotate(${hourDegrees}deg)`;
        this.minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
        this.secondHand.style.transform = `rotate(${secondDegrees}deg)`;

        // Update period (AM/PM)
        this.periodElement.textContent = hours >= 12 ? 'PM' : 'AM';
    }

    formatHour(hours) {
        hours = hours % 12;
        return hours === 0 ? '12' : this.padNumber(hours);
    }

    padNumber(number) {
        return number.toString().padStart(2, '0');
    }

    async keepAwake() {
        try {
            if ('wakeLock' in navigator) {
                const wakeLock = await navigator.wakeLock.request('screen');
                document.addEventListener('visibilitychange', async () => {
                    if (document.visibilityState === 'visible') {
                        await navigator.wakeLock.request('screen');
                    }
                });
            }
        } catch (err) {
            console.log(`WakeLock error: ${err.name}, ${err.message}`);
        }
    }
}

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('ServiceWorker registration failed:', err);
        });
    });
}

// Initialize the clock when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Clock();
});
