import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import '../CSS/registration.css';

function LogIn() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // ניקוי שגיאות בעת שינוי
  };

  const handleLogInButton = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/users/logIn', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // שמירת הטוקן
      sessionStorage.setItem('accessToken', data.token);

      // עדכון המשתמש בקונטקסט
      setUser(data.user);
      console.log(user);

      // ניווט לדף הבית
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form id="form" onSubmit={handleLogInButton}>
        <ul id="tabs" className="register-buttons active">
          <li className="tab">
            <Link to="/signUp" className="link-btn">Sign Up</Link>
          </li>
          <li className="tab active">
            <Link to="/logIn" className="link-btn">Log In</Link>
          </li>
        </ul>

        <div className="form-content">
          <h1>Welcome Back!</h1>

          <div className="input-group">
            <input
              className={`input ${error && !formData.email ? 'error' : ''}`}
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="input-group">
            <input
              className={`input ${error && !formData.password ? 'error' : ''}`}
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button
            id="button-save"
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'LOG IN'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LogIn;