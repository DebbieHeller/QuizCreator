import React, { useState, useEffect } from 'react';

function Quiz() {
  const [quizContent, setQuizContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // קריאה לשרת ליצירת חידון
    const fetchQuiz = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/createQuiz', {
          method: 'POST', // מתוד POST כפי שהגדרת בשרת
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        // אם הקריאה הצליחה
        if (response.ok) {
          const data = await response.json();
          setQuizContent(data); // נעדכן את מצב החידון עם התוצאה
        } else {
          throw new Error('Failed to fetch quiz');
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setQuizContent({ text: 'Failed to load quiz.' });
      } finally {
        setLoading(false); // לאחר שהבקשה הסתיימה, נסיים את מצב ה-loading
      }
    };

    fetchQuiz();
  }, []);

  return (
    <div>
      <h1>Quiz</h1>
      {loading ? (
        <p>Loading quiz...</p>
      ) : (
        <div>
          <h2>Generated Quiz Content:</h2>
          <p>{quizContent?.text}</p>
        </div>
      )}
    </div>
  );
}

export default Quiz;
