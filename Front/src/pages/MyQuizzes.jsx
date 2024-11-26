import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App'; // הנתיב עשוי להשתנות לפי מבנה הפרויקט שלך
import SingleQuestion from '../components/SingleQuestion'; // importing the SingleQuestion component

function MyQuizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [quizDetails, setQuizDetails] = useState(null); // מצב נוסף לשמירת פרטי החידון
    const [userAnswers, setUserAnswers] = useState({}); // לשמירת התשובות של המשתמש
    const [feedback, setFeedback] = useState({}); // לשמירת הפידבק על התשובות
    const [show, setShow] = useState(false); // מצב להצגת השאלות
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        console.log('quizDetails:', quizDetails);
    }, [quizDetails]);

    useEffect(() => {
        console.log(user.userID);

        const fetchQuizzes = async () => {
            if (!user?.userID) return;

            try {
                const response = await fetch(`http://localhost:5000/api/userQuizzes/${user.userID}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch quizzes: ${response.statusText}`);
                }
                const data = await response.json();
                setQuizzes(data);
            } catch (err) {
                console.error('Failed to fetch quizzes:', err);
            }
        };

        fetchQuizzes();
    }, [user]);

    const handleQuizClick = async (quizID) => {
        try {
            const response = await fetch(`http://localhost:5000/api/quizDetails/${quizID}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch quiz details: ${response.statusText}`);
            }
            const quizDetails = await response.json();
            setQuizDetails(quizDetails); // מעדכן את פרטי החידון בסטייט
            setShow(true); // מציג את השאלות
        } catch (err) {
            console.error('Failed to fetch quiz details:', err);
        }
    };

    const handleAnswerChange = (index, answer) => {
        setUserAnswers((prevAnswers) => ({
            ...prevAnswers,
            [index]: answer,
        }));
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    // פונקציה לחישוב הפידבק
    const handleSubmitQuiz = () => {
        const newFeedback = quizDetails.map((question, index) => {
            const userAnswer = userAnswers[index];
            const correctAnswer = question.correctAnswer;
            return userAnswer === correctAnswer ? 'Correct' : 'Incorrect';
        });
        setFeedback(newFeedback);
    };

    return (
        <div className="my-quizzes">
            <div className='navigation-buttons'>
                <button onClick={handleBackToHome} className="navButtons">Create Quiz</button>
                <button className="navButtons" onClick={() => {
                    setUser(null);
                    navigate('/');
                }}>
                    Sign Out
                </button>
            </div>

            <h2>My Quizzes</h2>
            {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                    <button
                        key={quiz.id}
                        onClick={() => handleQuizClick(quiz.id)}
                        className="quiz-button"
                    >
                        {quiz.topic}
                    </button>
                ))
            ) : (
                <p>No quizzes found.</p>
            )}

            {/* אם יש פרטי חידון והמשתנה show אמת, מציג את השאלות */}
            {show && quizDetails && (
                <div className="quiz-container">
                    <div className="quiz-details">
                        {quizDetails.map((question, index) => (
                            <SingleQuestion
                                key={index}
                                index={index}
                                question={question}
                                userAnswer={userAnswers[index]}
                                onAnswerChange={handleAnswerChange}
                                feedback={feedback[index]}
                            />
                        ))}
                        <button onClick={handleSubmitQuiz} id="button-save">Submit Quiz</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyQuizzes;
