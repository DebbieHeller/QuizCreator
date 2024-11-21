const express = require('express');
require('dotenv').config();
const cors = require('cors');
const quizRouter = require('./routes/QuizRouter'); // הפנייה ל-Router

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Route for testing API
app.get('/api/test', (req, res) => {
  res.send({ message: 'API is working!' });
});

// Using the Quiz router
app.use('/api', quizRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("wowowowowowowowow");
  
});
