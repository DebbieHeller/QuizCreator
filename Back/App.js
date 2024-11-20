const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.send({ message: 'API is working!' });
});

app.post('/api/createQuiz', async (req, res) => {
  console.log("heyyyy");
  console.log("API_KEY " + process.env.API_KEY);
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = 'make a quiz with 5 multiple choice questions on a random topic';
    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();
    
    res.json({ text: generatedText });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Failed to create quiz', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("!!!!!!!!!!!!!!!");
});