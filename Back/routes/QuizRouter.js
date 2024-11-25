const express = require('express');
const { createQuiz, getUserQuizzes, getQuizDetails } = require('../controllers/QuizController');

const router = express.Router();

// POST route for creating a quiz
router.post('/createQuiz', createQuiz);

// GET route for fetching user's quizzes
router.get('/userQuizzes/:userId', getUserQuizzes);

// GET route for fetching specific quiz details
router.get('/quizDetails/:quizId', getQuizDetails);

module.exports = router;
