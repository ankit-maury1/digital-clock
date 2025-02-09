function updateClock() {
  const now = new Date();
  const hours = now.getHours() % 12; // 12-hour format
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = now.getHours() >= 12 ? 'PM' : 'AM';

  const hourHand = document.querySelector('#hours svg circle:nth-child(2)');
  const minuteHand = document.querySelector('#minutes svg circle:nth-child(2)');
  const secondHand = document.querySelector('#seconds svg circle:nth-child(2)');

  const hourRotation = (hours * 30) + (minutes * 0.5); // 360 / 12 = 30 degrees per hour, 0.5 per minute
  const minuteRotation = (minutes * 6) + (seconds * 0.1); // 360 / 60 = 6 degrees per minute, 0.1 per second
  const secondRotation = seconds * 6; // 360 / 60 = 6 degrees per second

  // Apply rotation to clock hands
  hourHand.style.transform = `rotate(${hourRotation - 90}deg)`;
  minuteHand.style.transform = `rotate(${minuteRotation - 90}deg)`;
  secondHand.style.transform = `rotate(${secondRotation - 90}deg)`;

  // Update AM/PM text and smooth transition
  const ampmElement = document.getElementById('ampm');
  ampmElement.textContent = ampm;
  ampmElement.style.opacity = 0;
  setTimeout(() => {
    ampmElement.style.opacity = 1;
  }, 100); // Smooth fade-in effect
}

// Initial clock update
updateClock();

// Update the clock every second
setInterval(updateClock, 1000);
