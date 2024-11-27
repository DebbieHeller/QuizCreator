import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import CreateQuiz from "../components/CreateQuiz";
import SingleQuestion from "../components/SingleQuestion";
import { UserContext } from "../App";

const socket = io("http://localhost:5000"); // התחברות לשרת Socket.IO

function Quiz() {
  const [quizContent, setQuizContent] = useState(null);
  const [topic, setTopic] = useState("");
  const [userAnswers, setUserAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const { user, setUser } = useContext(UserContext);
  const [score, setScore] = useState(null);
  const [sharedEmail, setSharedEmail] = useState(""); // שדה למייל של המשתמש
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/SignUp')
    }
  }, [user]);
  // Client-side (Quiz component)
  useEffect(() => {
    if (!user) return;

    socket.emit('registerUser', user.email);

    // Listen for shared answers
    socket.on('receiveAnswers', (data) => {
      console.log('Received shared answers:', data);
      // Optional: Update UI to show shared answers
      setSharedAnswers(data.answers);
    });

    return () => {
      socket.off('receiveAnswers');
    };
  }, [user]);

  const handleSubmitQuiz1 = () => {
    const answers = userAnswers;
    socket.emit('shareAnswers', {
      userEmail: user.email,
      answers
    });

    // Existing submit logic...
  };

  // In client-side Quiz component
  useEffect(() => {
    // Only proceed if user is defined
    if (!user) return;

    // Use existing socket connection
    socket.emit('registerUser', user.email);

    const handleReceiveQuiz = (quizContent) => {
      console.log('Received quiz:', quizContent);
      setQuizContent(quizContent);
    };

    socket.on('receiveQuiz', handleReceiveQuiz);

    // Clean up listener
    return () => {
      socket.off('receiveQuiz', handleReceiveQuiz);
    };
  }, [user]); // Dependency on user ensures re-registration when user changes

  const handleShareQuiz = () => {
    if (!sharedEmail || !quizContent) {
      alert("Please enter an email and create a quiz first.");
      return;
    }

    socket.emit("shareQuiz", {
      userEmail: sharedEmail,
      quizContent
    });
    alert(`Quiz shared with ${sharedEmail}`);
  };

  const handleQuizCreated = (quizData, topic) => {
    setQuizContent(quizData);
    setTopic(topic);
    setUserAnswers({});
    setFeedback({});
    setScore(null);

    // שליחת החידון לשרת
    socket.emit("sendQuiz", { quizData, topic });
  };

  const handleAnswerChange = (questionIndex, selectedAnswer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedAnswer,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!quizContent?.quizData) return;

    let correctCount = 0;
    const newFeedback = {};

    // שלח תשובות לשרת
    const answers = userAnswers; // התשובות שלך

    // בדוק את התשובות
    quizContent.quizData.forEach((question, index) => {
      const isCorrect = userAnswers[index] === question.correctAnswer;
      correctCount += isCorrect ? 1 : 0;
      newFeedback[index] = isCorrect
        ? "Correct! 🎉"
        : `Incorrect. The correct answer is: ${question.correctAnswer}`;
    });

    const score = ((100 / quizContent.quizData.length) * correctCount).toFixed(2);

    // שלח לשרת עם התשובות והניקוד
    socket.emit('submitQuiz', { score, answers });

    setFeedback(newFeedback);
    setScore(score);
  };

  const handleEmailChange = (event) => {
    setSharedEmail(event.target.value);
  };

  const handleShareQuiz1 = async () => {
    if (!sharedEmail) {
      alert("Please enter an email to share the quiz.");
      return; // אם לא הוזן מייל, לא נשלח את הבקשה
    }

    try {
      // חיפוש משתמש לפי המייל שהוזן
      const response = await fetch(`http://localhost:5000/users?email=${sharedEmail}`);
      const data = await response.json();

      // אם המשתמש לא נמצא, לא נשלח את החידון
      if (data.error) {
        alert("User not found");
        return;
      }

      // אם המשתמש נמצא, נשלח את החידון
      const userId = data; // ה-ID של המשתמש
      socket.emit("shareQuiz", { userId, quizContent });

      alert(`Quiz shared with user ID: ${userId}`);
    } catch (error) {
      console.error("Error sharing quiz:", error);
      alert("There was an error sharing the quiz.");
    }
  };


  const handleNavigation = (path) => navigate(path);

  const handleSignOut = () => {
    setUser(null);
    sessionStorage.removeItem("accessToken");
    handleNavigation('/');
  }

  return (
    <div className="quiz-page">
      <div className="navigation-buttons">
        {!user && (
          <button
            className="navButtons"
            onClick={() => handleNavigation("/SignUp")}
          >
            SignUp
          </button>
        )}
        {user && (
          <>
            <button
              className="navButtons"
              onClick={() => handleNavigation("/my-quizzes")}
            >
              My Quizzes
            </button>
            <button className="navButtons" onClick={() => handleSignOut()}>
              Sign Out
            </button>
          </>
        )}
      </div>

      {/* יצירת חידון */}
      <CreateQuiz onQuizCreated={handleQuizCreated} />

      {/* טופס לשיתוף החידון */}
      <div>
        <input
          className="inputShareEmail"
          type="email"
          placeholder="Enter email to share with"
          value={sharedEmail}
          onChange={handleEmailChange}
        />
        {/* הכפתור ישלח את החידון רק אם הוזן מייל */}
        <button onClick={handleShareQuiz} disabled={!sharedEmail}>
          Share Quiz
        </button>
      </div>

      {/* הצגת החידון אם קיים */}
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
          <button id="button-save" onClick={handleSubmitQuiz}>Submit Quiz</button>
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
