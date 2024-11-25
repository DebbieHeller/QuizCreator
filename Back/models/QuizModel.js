const { GoogleGenerativeAI } = require('@google/generative-ai');
const pool = require('../DBQUIZ.js'); // ייבוא החיבור למסד הנתונים

const generateQuiz = async (questionCount, topic, userId) => {
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
    // יצירת חידון בעזרת בינה מלאכותית
    const result = await model.generateContent(prompt);
    let generatedText = result.response.text();

    // ניקוי JSON לא תקין
    generatedText = generatedText.replace(/```json|```/g, '').trim();
    const quizData = JSON.parse(generatedText);

    // עיבוד הנתונים כך שיהיו בפורמט הנדרש
    const formattedQuizData = quizData.map((question) => {
      return {
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer
      };
    });

    // אם userId לא שווה ל-0, שמור את החידון במסד הנתונים
    if (userId !== 0) {
      const quizId = await saveQuizToDatabase(topic, questionCount, formattedQuizData, userId);
      return {
        quizData: formattedQuizData,
      };
    } else {
      // אם userId שווה ל-0, אל תשמור ב-DB ותחזיר את הנתונים שהתקבלו
      console.log('Quiz not saved: userId is 0.');
      return {
        quizData: formattedQuizData,
      };
    }
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error('Failed to generate quiz');
  }
};

const saveQuizToDatabase = async (topic, questionCount, quizData, userId) => {
  const connection = await pool.getConnection();
  try {
    // הוספת חידון לטבלת החידונים
    const [quizResult] = await connection.execute(
      'INSERT INTO quizzes (topic, question_count, user_id) VALUES (?, ?, ?)',
      [topic, questionCount, userId]
    );
    const quizId = quizResult.insertId;

    // הוספת כל שאלה לטבלת השאלות
    for (const question of quizData) {
      const { question: questionText, options, correctAnswer } = question;
      await connection.execute(
        `INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_answer)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [quizId, questionText, options[0], options[1], options[2], options[3], correctAnswer]
      );
    }

    console.log('Quiz and questions saved to database');
    return quizId;
  } catch (error) {
    console.error('Error saving quiz to database:', error);
    throw new Error('Failed to save quiz to database');
  } finally {
    connection.release();
  }
};



// Fetch all quizzes created by a specific user
const fetchUserQuizzes = async (userId) => {
  console.log("fetchUserQuizzes model "+userId);
  
  const connection = await pool.getConnection();
  try {
    const [quizzes] = await connection.execute(
      'SELECT id, topic FROM quizzes WHERE user_id = ?',
      [userId]
    );
    return quizzes;
  } catch (error) {
    console.error('Error fetching user quizzes:', error);
    throw new Error('Failed to fetch user quizzes');
  } finally {
    connection.release();
  }
};

// Fetch details of a specific quiz
const fetchQuizDetails = async (quizId) => {
  const connection = await pool.getConnection();
  try {
    const [questions] = await connection.execute(
      `SELECT question, option1, option2, option3, option4, correct_answer
       FROM questions WHERE quiz_id = ?`,
      [quizId]
    );

    const formattedQuestions = questions.map((q) => ({
      question: q.question,
      options: [q.option1, q.option2, q.option3, q.option4],
      correctAnswer: q.correct_answer,
    }));

    return formattedQuestions;
  } catch (error) {
    console.error('Error fetching quiz details:', error);
    throw new Error('Failed to fetch quiz details');
  } finally {
    connection.release();
  }
};

module.exports = { generateQuiz, fetchUserQuizzes, fetchQuizDetails };
