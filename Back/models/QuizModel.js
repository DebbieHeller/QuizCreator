const { GoogleGenerativeAI } = require('@google/generative-ai');
const pool = require('../DBQUIZ.js'); // ייבוא החיבור למסד הנתונים

const generateQuiz = async (questionCount, topic) => {
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

    // ניקוי JSON לא תקין
    generatedText = generatedText.replace(/```json|```/g, '').trim();
    const quizData = JSON.parse(generatedText);

    // שמירת חידון ושאלות במסד נתונים
    const quizId = await saveQuizToDatabase(topic, questionCount, quizData);

    console.log(`Quiz ID ${quizId} and questions were added to the database!`);
    return { quizId, quizData };
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error('Failed to generate quiz');
  }
};

const saveQuizToDatabase = async (topic, questionCount, quizData) => {
  const connection = await pool.getConnection();
  try {
    // הוספת חידון
    const [quizResult] = await connection.execute(
      'INSERT INTO quizzes (topic, question_count) VALUES (?, ?)',
      [topic, questionCount]
    );
    const quizId = quizResult.insertId;

    // הוספת שאלות
    for (const question of quizData) {
      const { question: questionText, options, correctAnswer } = question;
      await connection.execute(
        `INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_answer)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [quizId, questionText, options[0], options[1], options[2], options[3], correctAnswer]
      );
    }

    return quizId;
  } catch (error) {
    console.error('Error saving quiz to database:', error);
    throw new Error('Failed to save quiz to database');
  } finally {
    connection.release();
  }
};

module.exports = { generateQuiz };
