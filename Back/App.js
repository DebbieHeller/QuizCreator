const express = require('express');
const cors = require('cors'); // ייבוא CORS
const { GoogleGenerativeAI } = require('@google/generative-ai'); // ודא שאתה משתמש בייבוא נכון
const app = express();
const PORT = 5000;
require('dotenv').config(); // סביבה

// Enable CORS
app.use(cors());

// Middleware
app.use(express.json());

// Example Route
app.get('/api/test', (req, res) => {
  res.send({ message: 'API is working!' });
});

app.post('/api/createQuiz', async (req, res) => {
  console.log("heyyyy")
  console.log(process.env.API_KEY)

  try {
    // יצירת מופע של GoogleGenerativeAI
    const genAI = new GoogleGenerativeAI({
      apiKey: process.env.API_KEY // שמור את ה-API KEY בקובץ .env
    });

    // הגדרת המודל עם שם המודל
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });  // מספק את שם המודל כפרמטר

    const prompt = "make a quiz";  // ההוראה/בקשה שלך

    // יצירת תוכן באמצעות המודל
    const result = await model.generateContent({ prompt: prompt });

    const generatedText = result.response.text; // תוצאה שהתקבלה

    // מחזירים את התוצאה ללקוח
    res.json({ text: generatedText });

  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
