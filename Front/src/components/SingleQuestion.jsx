import React, { useState } from "react";
import "../css/style.css";

function SingleQuestion({
  question,
  index,
  userAnswer,
  onAnswerChange,
  feedback
}) {
  return (
    <div className={`single-question ${feedback?.includes("Correct")
        ? "correct"
        : feedback?.includes("Incorrect")
          ? "incorrect"
          : ""
      }`}>
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
                checked={userAnswer === option}
                onChange={() => onAnswerChange(index, option)}
              />
              {option}
            </label>
          </div>
        ))}
      </form>
      {feedback && <p>{feedback}</p>}
      <hr />
    </div>
  );
}

export default SingleQuestion;
