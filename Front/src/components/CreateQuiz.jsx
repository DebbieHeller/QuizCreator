import React, { useState } from "react";
import "../css/style.css";

function CreateQuiz({ onQuizCreated }) {
  const [questionCount, setQuestionCount] = useState(5);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetchQuiz = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/createQuiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionCount,
          topic,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onQuizCreated(data, topic);
      } else {
        throw new Error("Failed to fetch quiz");
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      onQuizCreated([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-quiz">
      <h1>Create New Quiz</h1>
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
          Topic:
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleFetchQuiz} disabled={loading}>
        {loading ? "Creating Quiz..." : "Create Quiz"}
      </button>
    </div>
  );
}
export default CreateQuiz;
