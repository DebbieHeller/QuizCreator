import React, { useState, createContext, useEffect } from "react"; 
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import Quiz from './pages/Quiz'; 
import SignUp from './pages/SignUp';
import Login from './pages/LogIn';
import MyQuizzes from './pages/MyQuizzes'; 

export const UserContext = createContext();

// רכיב להגנה על נתיבים שלא ניתן לגשת אליהם ללא התחברות
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // בדיקת טוקן בחלון המקומי (localStorage)
  if (!token) {
    return <Navigate to="/login" replace />; // אם אין טוקן, מעבירים לדף התחברות
  }
  return children; // אם יש טוקן, מאפשרים גישה לנתיב המוגן
};

function App() {
  const [user, setUser] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 

  const handleSignOut = () => {
    sessionStorage.removeItem('accessToken'); 

    setUser(null); 
  };

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken'); 
    if (token) {
      fetch('http://localhost:5000/users/verify', { // בקשת אימות מהשרת
        headers: {
          'Authorization': `Bearer ${token}` // שליחת הטוקן באישור
        }
      })
        .then(res => res.json()) 
        .then(data => {
          if (data.user) {
            setUser(data.user); // אם האימות הצליח, שמירת פרטי המשתמש
          } else {
            sessionStorage.removeItem('accessToken'); 
          }
        })
        .catch(() => {
          sessionStorage.removeItem('accessToken'); 
        })
        .finally(() => {
          setIsLoading(false); 
        });
    } else {
      setIsLoading(false); // אם אין טוקן, מסיימים טעינה
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user, setUser, handleSignOut }}>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          } />
          <Route path="/signup" element={
            user ? <Navigate to="/" replace /> : <SignUp />
          } />
          <Route path="/login" element={
            user ? <Navigate to="/" replace /> : <Login />
          } />
          <Route path="/my-quizzes" element={
            <ProtectedRoute>
              <MyQuizzes userID={user?.id} /> 
            </ProtectedRoute>
          } />
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;