let username = localStorage.getItem('username');
let clickCount = parseInt(localStorage.getItem('clickCount')) || 0;

const nameInput = document.getElementById('nameInput');
const clickBtn = document.getElementById('clickBtn');
const logArea = document.getElementById('logArea');

// Connect to backend using Socket.IO
const socket = io('https://my-first-website-2-5qkz.onrender.com');

// Set username if already stored
if (username) {
  nameInput.value = username;
  nameInput.disabled = true;
}

// 🔌 Show the last 4 notifications when the page loads
socket.on('recent-notifs', (notifs) => {
  logArea.innerHTML = '';
  notifs.forEach(msg => {
    const logEntry = document.createElement('div');
    logEntry.textContent = msg;
    logArea.appendChild(logEntry);
  });
});

// 🔥 Show new clicks live from any browser
socket.on('new-click', (msg) => {
  const logEntry = document.createElement('div');
  logEntry.textContent = msg;
  logArea.prepend(logEntry);
});

clickBtn.addEventListener('click', () => {
  if (!username) {
    username = nameInput.value.trim();
    if (!username) return;
    localStorage.setItem('username', username);
    nameInput.disabled = true;
  }

  clickCount++;
  localStorage.setItem('clickCount', clickCount);

  // 👇 We no longer create local logs here — backend handles & broadcasts them
  fetch('https://my-first-website-2-5qkz.onrender.com/click', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      count: clickCount
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log('Response from backend:', data);
  })
  .catch(err => {
    console.error('Error sending click data:', err);
  });
});

function getOrdinal(n) {
  if (n % 100 >= 11 && n % 100 <= 13) return 'th';
  switch (n % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}
