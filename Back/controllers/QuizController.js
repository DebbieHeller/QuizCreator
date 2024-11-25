const { generateQuiz } = require('../models/QuizModel');

const createQuiz = async (req, res) => {
  try {
    console.log(req.body)
    const { questionCount, topic,userId } = req.body; // שינוי ל-topic

    // קריאה למודל ליצירת השאלון
    const quizData = await generateQuiz(questionCount, topic,userId);
    res.json(quizData);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Failed to create quiz', details: error.message });
  }
};

module.exports = { createQuiz };
