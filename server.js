const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Hello This Is My First Apis');
});
app.listen(PORT, () => {
  console.log(`Server Start Running on Port: ${PORT}`);
});
