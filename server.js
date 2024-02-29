// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Import path module
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const transactionRouter = require('./routes/transactions');
app.use('/transactions', transactionRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
