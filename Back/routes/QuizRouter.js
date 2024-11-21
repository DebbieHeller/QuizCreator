const express = require('express');
const { createQuiz } = require('../controllers/QuizController');

const router = express.Router();

// POST route for creating a quiz
router.post('/createQuiz', createQuiz);

module.exports = router;
