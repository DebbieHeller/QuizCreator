import React, { useState, useContext } from "react";
import "../css/style.css";
import { UserContext } from '../App';
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // חיבור לשרת Socket.IO

function CreateQuiz({ onQuizCreated }) {
  const [questionCount, setQuestionCount] = useState(5);
  const [topic, setTopic] = useState("");
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(false);

  const handleFetchQuiz = async () => {
    setLoading(true);

    try {
      const userId = user && user.userID ? user.userID : 0;
      console.log("User ID being sent:", userId);

      const response = await fetch("http://localhost:5000/api/createQuiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionCount,
          topic,
          userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onQuizCreated(data, topic);

        // שליחת החידון לשרת דרך Socket.IO
        socket.emit("sendQuiz", { quizData: data, topic });
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
            className="input"
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
            className="input"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </label>
      </div>
      <button className="createQuizBtn" onClick={handleFetchQuiz} disabled={loading}>
        {loading ? "Creating Quiz..." : "Create Quiz"}
      </button>
    </div>
  );
}

export default CreateQuiz;
