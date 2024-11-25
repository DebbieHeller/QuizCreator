import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App"; // ודא שהנתיב נכון
import '../CSS/Registation.css';

function LogIn() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // גישה ל-setUser מה-UserContext
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  const handleLogInButton = () => {
    if (!formData.email || !formData.password) {
      alert("Must Fill All Details");
      return;
    }

    const body = {
      email: formData.email,
      password: formData.password,
    };

    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    fetch(`http://localhost:5000/users/logIn`, request)
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => { throw new Error(error.error); });
        }
        return res.json();
      })
      .then(data => {
        const { user } = data;

        if (user) {
          setUser(user); // עדכון ה-UserContext
          alert("You logged in successfully!");
          navigate("/"); // מעבר לדף הבית
        } else {
          throw new Error("Login failed. User data is missing.");
        }
      })
      .catch(error => {
        setError(error.message);
        alert(error.message);
      });
  };

  return (
    <div>
      <div className="onTopBtn"></div>
      <form id="form">
        <ul id="tabs" className="register-buttons active">
          <li className="tab">
            <Link to="/signUp" className="link-btn">Sign Up</Link>
          </li>
          <li className="tab active">
            <Link to="/logIn" className="link-btn">Log In</Link>
          </li>
        </ul>
        <div>
          <h1>Welcome Back!</h1>
          <div className="User-fill">
            <input
              className="input"
              id="userEmail"
              onChange={handleChange}
              type="text"
              placeholder="userEmail"
              name="email"
              required
            />
          </div>
          <div className="User-fill">
            <input
              className="input"
              onChange={handleChange}
              id="userPassword"
              type="password"
              placeholder="Password"
              name="password"
              required
            />
          </div>
          <button
            type="button"
            id="button-save"
            onClick={handleLogInButton}
          >
            LOG-IN
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </form>
    </div>
  );
}

export default LogIn;
