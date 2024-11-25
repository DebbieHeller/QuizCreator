import React, { useState, createContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Quiz from './pages/Quiz';
import SignUp from './pages/SignUp';
import Login from './pages/LogIn';

export const UserContext = createContext();

// רכיב מגן על נתיבים
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/Login" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSignOut = () => {
    localStorage.removeItem('token'); // מחיקת הטוקן
    setUser(null); // איפוס המשתמש בקונטקסט
  };

  useEffect(() => {
    // בדיקת טוקן קיים והשגת פרטי משתמש
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/users/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem('token');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
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
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;