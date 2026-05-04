(() => {
  const clockEl = document.getElementById('clock');

  function updateClock() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    clockEl.textContent = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  updateClock();
  setInterval(updateClock, 1000);

  // Click to toggle cereal (but not on nav buttons)
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('.nav-btn') ||
        e.target.closest('#countdown-page')) return;
    document.body.classList.toggle('cereal');
  });

  // Countdown page
  const countdownPage = document.getElementById('countdown-page');
  const countdownForm = document.getElementById('countdown-form');
  const countdownDisplay = document.getElementById('countdown-display');
  const countdownTime = document.getElementById('countdown-time');
  const countdownLabel = document.getElementById('countdown-label');
  const eventInput = document.getElementById('event-input');
  const setEventBtn = document.getElementById('set-event');
  const toCountdownBtn = document.getElementById('to-countdown');
  const toClockBtn = document.getElementById('to-clock');
  const resetBtn = document.getElementById('reset-countdown');

  let targetTime = null;
  let randomOffsetMs = 0;
  let countdownInterval = null;

  // Restore saved event
  const saved = localStorage.getItem('countdown-event');
  if (saved) {
    const data = JSON.parse(saved);
    targetTime = data.target;
    randomOffsetMs = data.offset;
  }

  toCountdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    countdownPage.classList.add('active');
    if (targetTime) {
      showCountdown();
    }
  });

  toClockBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    countdownPage.classList.remove('active');
  });

  resetBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    clearInterval(countdownInterval);
    targetTime = null;
    randomOffsetMs = 0;
    localStorage.removeItem('countdown-event');
    countdownDisplay.classList.remove('active');
    countdownForm.style.display = '';
    resetBtn.style.display = 'none';
  });

  setEventBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const val = eventInput.value;
    if (!val) return;
    targetTime = new Date(val).getTime();
    randomOffsetMs = Math.random() * 5 * 60 * 1000; // 0 to 5 minutes in ms
    localStorage.setItem('countdown-event', JSON.stringify({
      target: targetTime,
      offset: randomOffsetMs
    }));
    showCountdown();
  });

  function showCountdown() {
    countdownForm.style.display = 'none';
    countdownDisplay.classList.add('active');
    resetBtn.style.display = '';
    updateCountdown();
    clearInterval(countdownInterval);
    countdownInterval = setInterval(updateCountdown, 1000);
  }

  function updateCountdown() {
    const now = Date.now();
    const diff = targetTime - now - randomOffsetMs;

    if (diff <= 0) {
      countdownTime.textContent = '0:00:00';
      countdownTime.classList.add('past');
      countdownLabel.textContent = 'Time\'s up!';
      clearInterval(countdownInterval);
      return;
    }

    countdownTime.classList.remove('past');
    const totalSec = Math.floor(diff / 1000);
    const days = Math.floor(totalSec / 86400);
    const hrs = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;

    const pad = (n) => String(n).padStart(2, '0');

    if (days > 0) {
      countdownTime.textContent = `${days}d ${hrs}:${pad(mins)}:${pad(secs)}`;
    } else {
      countdownTime.textContent = `${hrs}:${pad(mins)}:${pad(secs)}`;
    }
    countdownLabel.textContent = 'remaining';
  }
})();
