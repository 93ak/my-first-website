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
