const express = require('express');
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Example Route
app.get('/api/test', (req, res) => {
  res.send({ message: 'API is working!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
