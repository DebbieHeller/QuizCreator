const { generateQuiz, fetchUserQuizzes, fetchQuizDetails  } = require('../models/QuizModel');

const createQuiz = async (req, res) => {
  try {
    console.log(req.body)
    const { questionCount, topic,userId } = req.body; // שינוי ל-topic
    const quizData = await generateQuiz(questionCount, topic,userId);
    res.json(quizData);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Failed to create quiz', details: error.message });
  }
};

// Fetch all quizzes for a specific user
const getUserQuizzes = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Request received for userId:", userId);
    
    const quizzes = await fetchUserQuizzes(userId);
    console.log("Quizzes fetched:", quizzes);
    
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching user quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch user quizzes' });
  }
};

// Fetch details of a specific quiz
const getQuizDetails = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quizDetails = await fetchQuizDetails(quizId);
    res.json(quizDetails);
  } catch (error) {
    console.error('Error fetching quiz details:', error);
    res.status(500).json({ error: 'Failed to fetch quiz details' });
  }
};

module.exports = { createQuiz, getUserQuizzes, getQuizDetails };

