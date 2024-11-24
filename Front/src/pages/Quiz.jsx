import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SingleQuestion from "../components/SingleQuestion";
import { UserContext } from '../App'; // ייבוא של UserContext

function Quiz() {
  const [quizContent, setQuizContent] = useState(null); 
  const [topic, setTopic] = useState("");
  const [userAnswers, setUserAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const { user, setUser } = useContext(UserContext); // שימוש ב-context
  const [score, setScore] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (quizContent?.quizData?.length > 0) {
      console.log("Quiz content updated:", quizContent.quizData);
    }
  }, [quizContent]);

  const handleQuizCreated = (quizData, topic) => {
    setQuizContent(quizData); // Store the entire object
    setTopic(topic);
    setUserAnswers({});
    setFeedback({});
    setScore(null);
  };

  const handleAnswerChange = (questionIndex, selectedAnswer) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: selectedAnswer,
    });
  };

  const handleSubmitQuiz = () => {
    if (!quizContent?.quizData) return;

    let correctCount = 0;
    const newFeedback = {};
    
    quizContent.quizData.forEach((question, index) => {
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
    const totalScore = (100 / quizContent.quizData.length) * correctCount;
    setScore(totalScore.toFixed(2));
  };

  const handleSignOut = () => {
    setUser(null); // התנתקות מהמשתמש
    navigate('/'); // ניווט לעמוד הבית אחרי התנתקות
  };

  const handleSignUpClick = () => {
    navigate('/SignUp');
  };

  const handleMyQuizzesClick = () => {
    navigate('/myQuizzes'); // ניווט לעמוד "הבחנים שלי"
  };

  return (
    <div>
      {/* הצגת כפתור SIGN UP אם אין משתמש מחובר */}
      {!user && (
        <div className="SignUp">
          <button onClick={handleSignUpClick}>SignUp</button>
        </div>
      )}

      {/* הצגת כפתור "הבחנים שלי" אם יש משתמש מחובר */}
      {user && (
        <div className="my-quizzes">
          <button onClick={handleMyQuizzesClick}>my-quizzes</button>
        </div>
      )}

      {/* הצגת כפתור "Sign Out" אם יש משתמש מחובר */}
      {user && (
        <div className="sign-out">
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      )}
      
      <SingleQuestion onQuizCreated={handleQuizCreated} />
      
      
      {quizContent?.quizData && quizContent.quizData.length > 0 ? (
        <div className="quiz-container">
          <h2>Quiz on "{topic}"</h2>
          {quizContent.quizData.map((question, index) => (
            <div
              key={index}
              className={`single-question ${
                feedback[index]?.includes("Correct")
                  ? "correct"
                  : feedback[index]?.includes("Incorrect")
                  ? "incorrect"
                  : ""
              }`}
            >
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
