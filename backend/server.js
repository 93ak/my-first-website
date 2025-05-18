const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const http = require('http');               // new
const { Server } = require('socket.io');    // new

const app = express();
const PORT = process.env.PORT || 3000;

// Create http server and socket.io server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://93ak.github.io',
    methods: ['GET', 'POST']
  }
});

const uri = process.env.MONGO_URI || 'mongodb+srv://akshara:tharan@cluster0.gbsvtmq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);
let db;

const recentNotifs = []; // store last 4 notifications in-memory

client.connect()
  .then(() => {
    db = client.db('clickApp');
    console.log('✅ Connected to MongoDB');

    // Start server only after DB connection
    server.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });

app.use(cors({
  origin: 'https://93ak.github.io'
}));
app.use(express.json());

// When client connects, send recent notifications
io.on('connection', (socket) => {
  console.log('a user connected');

  // Send last 4 notifications on new connection
  socket.emit('recent-notifs', recentNotifs);
});

// POST click handler
app.post('/click', async (req, res) => {
  const { username, count } = req.body;
  console.log(`${username} clicked ${count} times.`);

  try {
    const collection = db.collection('clicks');
    const existing = await collection.findOne({ username });

    if (existing) {
      await collection.updateOne({ username }, { $set: { count } });
    } else {
      await collection.insertOne({ username, count });
    }

    // Create the notification message
    const notifMsg = `${username} just clicked the button for the ${count}${getOrdinal(count)} time!`;

    // Add to recent notifications (max 4)
    recentNotifs.unshift(notifMsg);
    if (recentNotifs.length > 4) recentNotifs.pop();

    // Broadcast this notification to all connected clients
    io.emit('new-click', notifMsg);

    res.json({ message: 'Click received and saved' });
  } catch (err) {
    console.error('❌ Error saving click:', err);
    res.status(500).json({ error: 'Failed to save click' });
  }
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
