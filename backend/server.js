const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb'); // 👈 1. Import MongoDB driver

const app = express();
const PORT = process.env.PORT || 3000;

// 2. MongoDB connection
const uri = process.env.MONGO_URI || 'mongodb+srv://akshara:tharan@cluster0.gbsvtmq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // 👈 replace with your real URI
const client = new MongoClient(uri);
let db;

client.connect()
  .then(() => {
    db = client.db('clickApp');
    console.log('✅ Connected to MongoDB');

    // Start server only after successful DB connection
    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });

// 3. Middlewares
app.use(cors({
  origin: 'https://93ak.github.io'
}));
app.use(express.json());

// 4. Click handler with DB save
app.post('/click', async (req, res) => {
  const { username, count } = req.body;
  console.log(`${username} clicked ${count} times.`);

  try {
    const collection = db.collection('clicks'); // 👈 collection name
    const existing = await collection.findOne({ username });

    if (existing) {
      await collection.updateOne({ username }, { $set: { count } });
    } else {
      await collection.insertOne({ username, count });
    }

    res.json({ message: 'Click received and saved' });
  } catch (err) {
    console.error('❌ Error saving click:', err);
    res.status(500).json({ error: 'Failed to save click' });
  }
});

// 5. Optional: Get total clicks
app.get('/total-clicks', async (req, res) => {
  try {
    const collection = db.collection('clicks');
    const result = await collection.aggregate([
      { $group: { _id: null, total: { $sum: '$count' } } }
    ]).toArray();

    const total = result[0]?.total || 0;
    res.json({ total });
  } catch (err) {
    console.error('❌ Error fetching total clicks:', err);
    res.status(500).json({ error: 'Failed to fetch total clicks' });
  }
});


