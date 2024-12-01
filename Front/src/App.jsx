import React, { useState, createContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Quiz from "./pages/Quiz";
import SignUp from "./pages/SignUp";
import Login from "./pages/LogIn";
import MyQuizzes from "./pages/MyQuizzes";

// יצירת הקשר (Context) עבור המשתמש
export const UserContext = createContext();

// רכיב להגנה על נתיבים מוגנים
const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("accessToken"); // בדיקת טוקן ב-sessionStorage
  if (!token) {
    return <Navigate to="/login" replace />; // הפניה לדף התחברות אם אין טוקן
  }
  return children; // מתן גישה לנתיב המוגן אם יש טוקן
};

function App() {
  const [user, setUser] = useState(null); // סטייט עבור פרטי המשתמש
  const [isLoading, setIsLoading] = useState(true); // סטייט עבור טעינה

  // התנתקות משתמש
  const handleSignOut = () => {
    sessionStorage.removeItem("accessToken"); // מחיקת הטוקן מהאחסון
    setUser(null); // איפוס פרטי המשתמש
  };

  // אימות משתמש בקומפוננטת useEffect
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      fetch("http://localhost:5000/users/verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // הוספת טוקן בכותרות הבקשה
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user); // שמירת נתוני המשתמש אם האימות הצליח
          } else {
            sessionStorage.removeItem("accessToken"); // הסרה אם הטוקן לא חוקי
          }
        })
        .catch(() => {
          sessionStorage.removeItem("accessToken"); // טיפול בטעויות
        })
        .finally(() => {
          setIsLoading(false); // סיום מצב טעינה
        });
    } else {
      setIsLoading(false); // אם אין טוקן, מסיימים את מצב הטעינה
    }
  }, []);

  // מסך טעינה במצב של isLoading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user, setUser, handleSignOut }}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/" replace /> : <SignUp />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/my-quizzes"
            element={
              <ProtectedRoute>
                <MyQuizzes userID={user?.id} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
