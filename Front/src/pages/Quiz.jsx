import React, { useState } from "react";

function Quiz() {
  const [quizContent, setQuizContent] = useState([]); // Store quiz as an array of questions
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(5); // Default: 5 questions
  const [extraData, setExtraData] = useState(""); // Additional context for the quiz

  const handleFetchQuiz = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/createQuiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionCount, // Number of questions
          extraData, // Additional topic or context
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setQuizContent(data); // Assume data.text contains the array of questions
      } else {
        throw new Error("Failed to fetch quiz");
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      setQuizContent([]); // Reset quiz content on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Quiz Generator</h1>

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
          Extra Data (Topic):
          <input
            type="text"
            value={extraData}
            onChange={(e) => setExtraData(e.target.value)}
          />
        </label>
      </div>

      <button onClick={handleFetchQuiz} disabled={loading}>
        {loading ? "Creating Quiz..." : "Create Quiz"}
      </button>

      <div>
        {loading && <p>Loading quiz...</p>}
        {!loading && quizContent.length > 0 && (
          <div>
            <h2>Generated Quiz on "{extraData}"</h2>
            <h3>Number of Questions: {questionCount}</h3>
            {quizContent.map((question, index) => (
              <div key={index}>
                <p>
                  <strong>Q{index + 1}:</strong> {question.question}
                </p>
                <ol type="a">
                  {question.options.map((choice, idx) => (
                    <li key={idx}>{choice}</li>
                  ))}
                </ol>
                <p>
                  <strong>Answer:</strong> {question.correctAnswer}
                </p>
                <hr />
              </div>
            ))}
          </div>
        )}
        {!loading && quizContent.length === 0 && <p>No quiz data available.</p>}
      </div>
    </div>
  );
}

export default Quiz;
