const express = require('express')
const cors = require('cors')
app.use(cors())

const app = express()
const PORT = process.env.PORT || 3000


app.use(express.json())

app.post('/click', (req, res) => {
  const { username, count } = req.body
  console.log(`${username} clicked ${count} times.`)
  res.json({ message: 'Click received.' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
