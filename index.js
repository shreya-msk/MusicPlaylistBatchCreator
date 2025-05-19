const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/playlistDB');

mongoose.connection.once('open', () => {
  console.log('MongoDB connected locally');
});

app.get('/', (req, res) => {
  res.send('Music Playlist Batch Creator Backend is running');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });
// Define a Mongoose schema and model for playlist
const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  album: String
});

const Song = mongoose.model('Song', songSchema);


app.post('/upload', upload.single('csvFile'), (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        await Song.insertMany(results); // Save to MongoDB
        res.json(results);
      } catch (err) {
        console.error('Error saving to MongoDB:', err);
        res.status(500).json({ message: 'Error saving songs' });
      }
    });
});
app.get('/songs', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching songs' });
  }
});

