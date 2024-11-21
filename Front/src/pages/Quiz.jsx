import React, { useState } from "react";
import SingleQuiz from "../components/SingleQuiz";

function Quiz() {
  const [quizContent, setQuizContent] = useState([]); // Store quiz questions
  const [extraData, setExtraData] = useState(""); // Quiz topic
  const [userAnswers, setUserAnswers] = useState({}); // Track user-selected answers
  const [feedback, setFeedback] = useState({}); // Track feedback for each question
  const [score, setScore] = useState(null); // Track the total score

  const handleQuizCreated = (quizData, topic) => {
    setQuizContent(quizData); // Update quiz questions
    setExtraData(topic); // Update quiz topic
    setUserAnswers({}); // Reset user answers
    setFeedback({}); // Reset feedback
    setScore(null); // Reset score
  };

  const handleAnswerChange = (questionIndex, selectedAnswer) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: selectedAnswer,
    });
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    const newFeedback = {};

    quizContent.forEach((question, index) => {
      const correctAnswer = question.correctAnswer;
      const userAnswer = userAnswers[index];

      if (userAnswer === correctAnswer) {
        correctCount++;
        newFeedback[index] = "Correct! 🎉";
      } else {
        newFeedback[index] = `Incorrect. The correct answer is: ${correctAnswer}`;
      }
    });

    setFeedback(newFeedback);

    // Calculate the score: (100 / total questions) * correct answers
    const totalScore = (100 / quizContent.length) * correctCount;
    setScore(totalScore.toFixed(2)); // Round to 2 decimal places
  };

  return (
    <div>
      <SingleQuiz onQuizCreated={handleQuizCreated} />

      {quizContent.length > 0 && (
        <div>
          <h2>Quiz on "{extraData}"</h2>
          {quizContent.map((question, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <p>
                <strong>Q{index + 1}:</strong> {question.question}
              </p>
              <form>
                {question.options.map((option, idx) => (
                  <div key={idx}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={userAnswers[index] === option}
                        onChange={() => handleAnswerChange(index, option)}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </form>
              {feedback[index] && <p>{feedback[index]}</p>}
              <hr />
            </div>
          ))}
          <button onClick={handleSubmitQuiz}>Submit Quiz</button>
          {score !== null && (
            <div>
              <h3>Your Score: {score}/100</h3>
            </div>
          )}
        </div>
      )}
      {quizContent.length === 0 && <p>No quiz data available. Create a quiz to start!</p>}
    </div>
  );
}

export default Quiz;
