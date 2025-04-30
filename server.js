require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const statesRouter = require('./routes/states');
const connectDB = require('./config/dbConn');

const PORT = process.env.PORT || 3500;

// DB connection
connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
app.use('/states', statesRouter);

// Catch-all 404 handler
app.all('*', (req, res) => {
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  } else if (req.accepts('json')) {
    res.status(404).json({ error: '404 Not Found' });
  } else {
    res.status(404).type('txt').send('404 Not Found');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));