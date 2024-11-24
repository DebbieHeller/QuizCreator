import React, { useState, createContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Quiz from './pages/Quiz';
import SignUp from './pages/SignUp';
import Login from './pages/LogIn'
// import Profile from './pages/Profile';
export const UserContext = createContext();

function App() {
  const [user, setUser] = useState({});

  return (
    <BrowserRouter>
      <div id="everything">
        <UserContext.Provider value={{ user, setUser }}>
          {/* ניתוב לכל העמודים */}
          <Routes>
            <Route path="/" element={<Quiz />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </UserContext.Provider>

      </div>
    </BrowserRouter>
  );
}

export default App;