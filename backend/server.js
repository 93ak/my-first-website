const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from your GitHub Pages domain
app.use(cors({
  origin: 'https://93ak.github.io'
}));

app.use(express.json());

// API route only
app.post('/click', (req, res) => {
  const { username, count } = req.body;
  console.log(`${username} clicked ${count} times.`);
  res.json({ message: 'Click received' });
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
