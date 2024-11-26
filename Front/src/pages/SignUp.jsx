import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from '../App';
import '../CSS/registration.css';

function SignUp() {
    const { setUser } = useContext(UserContext);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [validationError, setValidationError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegisterButton = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // ולידציה
        if (!userName || !email || !password || !verifyPassword) {
            setValidationError('Please fill in all fields.');
            setIsLoading(false);
            return;
        }

        if (password !== verifyPassword) {
            setValidationError('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        const body = {
            userName: userName,
            email: email,
            password: password,
        };

        try {
            const response = await fetch('http://localhost:5000/users/signUp', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // שמירת הטוקן
            localStorage.setItem('token', data.token);

            // עדכון המשתמש בקונטקסט
            setUser(data.user);

            // הודעת הצלחה
            alert("You have successfully registered!");

            // מעבר לדף הבית
            navigate('/');
        } catch (error) {
            setValidationError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <form id="form">
                <ul id="tabs" className="register-buttons active">
                    <li className="tab active">
                        <Link to="/signUp" className="link-btn">Sign Up</Link>
                    </li>
                    <li className="tab">
                        <Link to="/logIn" className="link-btn">Log In</Link>
                    </li>
                </ul>
                <div className="content" id="signUpForm">
                    <h1>Sign-Up</h1>
                    <input
                        type="text"
                        className="input"
                        name="userName"
                        placeholder="User Name"
                        onChange={(e) => setUserName(e.target.value)}
                        value={userName}
                        disabled={isLoading}
                    />
                    <input
                        type="email"
                        className="input"
                        name="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        disabled={isLoading}
                    />
                    <div className="password">
                        <input
                            type="password"
                            className="input"
                            name="password"
                            placeholder="Set A Password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            disabled={isLoading}
                            required
                        />
                        <input
                            type="password"
                            className="input"
                            name="verify-password"
                            placeholder="Verify-Password"
                            onChange={(e) => setVerifyPassword(e.target.value)}
                            value={verifyPassword}
                            disabled={isLoading}
                            required
                        />
                    </div>
                    {validationError && <p className="error-message">{validationError}</p>}
                    <button
                        id="button-save"
                        onClick={handleRegisterButton}
                        disabled={isLoading}
                    >
                        {isLoading ? 'SIGNING UP...' : 'GET STARTED'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SignUp;