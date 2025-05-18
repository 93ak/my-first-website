const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.static('../frontend')) // Serve frontend files if needed

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../frontend/index.html') // Optional if serving frontend
})

// Example API route
app.post('/click', (req, res) => {
  const { username, count } = req.body
  console.log(`${username} clicked ${count} times.`)
  res.json({ message: 'Received click count.' })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
