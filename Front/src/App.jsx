import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Quiz from './pages/Quiz';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <div id="everything">
        {/* ניתוב לכל העמודים */}
        <Routes>
          <Route path="/" element={<Quiz />} /> {/* עמוד ברירת המחדל */}
          {/* <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
