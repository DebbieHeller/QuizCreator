import React, { useState } from "react";

function Quiz() {
  const [quizContent, setQuizContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(5); // ברירת מחדל: 5 שאלות
  const [extraData, setExtraData] = useState(""); // נתונים נוספים שנשלח עם הקריאה

  const handleFetchQuiz = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/createQuiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionCount, // מספר השאלות
          extraData, // נתונים נוספים
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setQuizContent(data); // עדכון עם תוכן החידון
      } else {
        throw new Error("Failed to fetch quiz");
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      setQuizContent({ text: "Failed to load quiz." });
    } finally {
      setLoading(false); // סיום מצב ה-loading
    }
  };

  return (
    <div>
      <h1>Quiz</h1>
      <div>
        <label>
          Number of Questions:
          <input
            type="number"
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
            min="1"
          />
        </label>
      </div>
      <div>
        <label>
          Extra Data:
          <input
            type="text"
            value={extraData}
            onChange={(e) => setExtraData(e.target.value)}
          />
        </label>
      </div>

      <button onClick={handleFetchQuiz}>Create Quiz</button>

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
