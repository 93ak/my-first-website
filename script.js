let username = localStorage.getItem('username')
let clickCount = parseInt(localStorage.getItem('clickCount')) || 0

const nameInput = document.getElementById('nameInput')
const clickBtn = document.getElementById('clickBtn')
const logArea = document.getElementById('logArea')

if (username) {
  nameInput.value = username
  nameInput.disabled = true
}

clickBtn.addEventListener('click', () => {
  if (!username) {
    username = nameInput.value.trim()
    if (!username) return
    localStorage.setItem('username', username)
    nameInput.disabled = true
  }

  clickCount++
  localStorage.setItem('clickCount', clickCount)
  fetch('https://your-backend-url.com/click', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: username,
    clickCount: clickCount
  })
})
.then(res => res.json())
.then(json => console.log('Data saved to DB:', json))
.catch(err => console.error('Failed to save data:', err))

  const logEntry = document.createElement('div')
  logEntry.textContent = `${username} just clicked the button for the ${clickCount}${getOrdinal(clickCount)} time!`
  logArea.prepend(logEntry)
})

function getOrdinal(n) {
  if (n % 100 >= 11 && n % 100 <= 13) return 'th'
  switch (n % 10) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}
