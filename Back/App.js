const express = require("express");
require("dotenv").config();
const cors = require("cors");
const http = require("http"); // ספרייה לניהול HTTP
const { Server } = require("socket.io"); // Socket.IO

const quizRouter = require("./routes/QuizRouter"); // הפנייה ל-Router
const UsersRouter = require("./routes/UsersRouter");

const app = express();

// middleware כדי לטפל ב-URL query parameters
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // אם אתה שולח גם JSON בבקשה
const PORT = 5000;

// יצירת שרת HTTP
const server = http.createServer(app);

// הגדרת Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // אפשר להתאים את זה לדומיינים מאושרים
    methods: ["GET", "POST"],
  },
});

// מאחסן את ה-Socket IDs של כל המשתמשים
// In server-side Socket.IO setup
let userSockets = {};

io.on("connection", (socket) => {
  socket.on("registerUser", (userIdentifier) => {
    userSockets[userIdentifier] = socket.id;
    console.log(`User registered: ${userIdentifier}`);
  });

  socket.on("shareQuiz", ({ userEmail, quizContent }) => {
    const targetSocketId = userSockets[userEmail];

    if (targetSocketId) {
      io.to(targetSocketId).emit("receiveQuiz", quizContent);
      console.log(`Quiz shared with ${userEmail}`);
    } else {
      console.log(`No socket found for ${userEmail}`);
    }
  });
});

// Server-side Socket.IO
io.on("connection", (socket) => {
  socket.on("shareAnswers", (data) => {
    const { userEmail, answers } = data;

    // Broadcast answers to all connected clients
    io.emit("receiveAnswers", {
      userEmail,
      answers,
    });
  });
});

app.use(cors());
app.use(express.json());

// Route for testing API
app.get("/api/test", (req, res) => {
  res.send({ message: "API is working!" });
});

// הוספת Routes קיימים
app.use("/api", quizRouter);
app.use("/users", UsersRouter);

// Socket.IO Events
io.on("connection", (socket) => {
  // שמירה על ה-Socket ID של כל משתמש
  socket.on("registerUser", (userId) => {
    // אם המשתמש מתחבר, נשמור את ה-Socket ID שלו
    userSockets[userId] = socket.id;
    console.log(`User registered with ID: ${userId}`);
  });

  // אירוע שליחת חידון עם מייל
  socket.on("shareQuiz", ({ userId, quizContent }) => {
    console.log(`Attempting to share quiz with user ID: ${userId}`);

    if (userId) {
      // שולחים את החידון למשתמש עם ה-ID הספציפי
      io.to(userId).emit("receiveQuiz", quizContent);
      console.log(`Shared quiz with user ID: ${userId}`);
    } else {
      console.error(`User ID ${userId} not found or not registered`);
    }
  });

  // אירוע שליחת תשובות והניקוד
  socket.on("submitQuiz", (data) => {
    const { score, answers } = data;
    console.log(`Received score: ${score}`);
    console.log(`Answers: ${answers}`);

    // שלח את הניקוד לכל הלקוחות
    io.emit("receiveScore", { score, answers });
  });

  // אירוע התנתקות
  socket.on("disconnect", () => {
    // כאשר משתמש מתנתק, נסיר את ה-Socket ID מהמפה
    for (let userId in userSockets) {
      if (userSockets[userId] === socket.id) {
        delete userSockets[userId];
      }
    }
  });
});

// הרצת השרת
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
