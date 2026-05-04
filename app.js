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

  document.body.addEventListener('click', () => {
    document.body.classList.toggle('cereal');
  });
})();
