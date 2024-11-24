import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CreateQuiz from "../components/CreateQuiz";
import SingleQuestion from "../components/SingleQuestion";
import { UserContext } from '../App';

function Quiz() {
  const [quizContent, setQuizContent] = useState(null);
  const [topic, setTopic] = useState("");
  const [userAnswers, setUserAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const { user, setUser } = useContext(UserContext);
  const [score, setScore] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (quizContent?.quizData?.length > 0) {
      console.log("Quiz content updated:", quizContent.quizData);
    }
  }, [quizContent]);

  const handleQuizCreated = (quizData, topic) => {
    setQuizContent(quizData);
    setTopic(topic);
    setUserAnswers({});
    setFeedback({});
    setScore(null);
  };

  const handleAnswerChange = (questionIndex, selectedAnswer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedAnswer,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!quizContent?.quizData) return;

    let correctCount = 0;
    const newFeedback = {};
    
    quizContent.quizData.forEach((question, index) => {
      const isCorrect = userAnswers[index] === question.correctAnswer;
      correctCount += isCorrect ? 1 : 0;
      newFeedback[index] = isCorrect 
        ? "Correct! 🎉" 
        : `Incorrect. The correct answer is: ${question.correctAnswer}`;
    });

    setFeedback(newFeedback);
    setScore(((100 / quizContent.quizData.length) * correctCount).toFixed(2));
  };

  const handleNavigation = (path) => navigate(path);

  return (
    <div className="quiz-page">
      <div className="navigation-buttons">
        {!user && (
          <button onClick={() => handleNavigation('/SignUp')}>SignUp</button>
        )}
        {user && (
          <>
            <button onClick={() => handleNavigation('/myQuizzes')}>
              My Quizzes
            </button>
            <button onClick={() => {
              setUser(null);
              handleNavigation('/');
            }}>
              Sign Out
            </button>
          </>
        )}
      </div>

      <CreateQuiz onQuizCreated={handleQuizCreated} />
      
      {quizContent?.quizData?.length > 0 ? (
        <div className="quiz-container">
          <h2>Quiz on "{topic}"</h2>
          {quizContent.quizData.map((question, index) => (
            <SingleQuestion
              key={index}
              question={question}
              index={index}
              userAnswer={userAnswers[index]}
              onAnswerChange={handleAnswerChange}
              feedback={feedback[index]}
            />
          ))}
          <button onClick={handleSubmitQuiz}>Submit Quiz</button>
          {score !== null && (
            <div className="score-container">
              <h3>Your Score: {score}/100</h3>
            </div>
          )}
        </div>
      ) : (
        <p>No quiz data available. Create a quiz to start!</p>
      )}
    </div>
  );
}

export default Quiz;