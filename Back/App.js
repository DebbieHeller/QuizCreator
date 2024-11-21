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
  console.log(req.body);
  console.log("heyyyy");
  console.log("API_KEY " + process.env.API_KEY);

  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `make for me a quiz with ${req.body.questionCount} about the ${req.body.extraData}. The test should be in the form of an American test - with 4 answer choices but only one of the options will be the correct answer. Do not show instructions. Return the quiz in this JSON structure:
[
  {
    "question": "What is the correct way to declare a variable named 'x' of type integer in C++?",
    "options": [
      "int x = 10;",
      "var x = 10;",
      "integer x = 10;",
      "x = 10;"
    ],
    "correctAnswer": "int x = 10;"
  }
]`;

    const result = await model.generateContent(prompt);
    let generatedText = result.response.text();

    // Remove non-JSON elements such as code fences
    generatedText = generatedText.replace(/```json|```/g, '').trim();

    // Parse cleaned text into JSON
    let quizData;
    try {
      quizData = JSON.parse(generatedText);
    } catch (parseError) {
      console.error("Error parsing generated text to JSON:", parseError);
      throw new Error("Invalid JSON format received from AI");
    }

    res.json(quizData);
    console.log("Quiz Data:", quizData);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Failed to create quiz', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("!!!!!!!!!!!!!!!");
});