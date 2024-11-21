const { GoogleGenerativeAI } = require('@google/generative-ai');

const generateQuiz = async (questionCount, topic) => { // שינוי ל-topic
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `make for me a quiz with ${questionCount} questions about ${topic}. The test should be in the form of an American test - with 4 answer choices but only one of the options will be the correct answer. Do not show instructions. Return the quiz in this JSON structure:
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

  try {
    const result = await model.generateContent(prompt);
    let generatedText = result.response.text();

    // Remove non-JSON elements such as code fences
    generatedText = generatedText.replace(/```json|```/g, '').trim();

    // Parse cleaned text into JSON
    let quizData;
    try {
      quizData = JSON.parse(generatedText);
    } catch (parseError) {
      console.error('Error parsing generated text to JSON:', parseError);
      throw new Error('Invalid JSON format received from AI');
    }

    return quizData;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error('Failed to generate quiz');
  }
};

module.exports = { generateQuiz };
