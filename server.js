const express = require('express');
const connectDB = require('./config/db');
const app = express();
// Connecting To Database
connectDB();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Hello This Is My First Apis');
});

// Defining routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/post'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/post'));

app.listen(PORT, () => {
  console.log(`Server Start Running on Port: ${PORT}`);
});
