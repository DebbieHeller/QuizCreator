const express = require("express"); 
require("dotenv").config(); 
const cors = require("cors"); 
const http = require("http"); 
const { Server } = require("socket.io"); 

const quizRouter = require("./routes/QuizRouter"); 
const UsersRouter = require("./routes/UsersRouter"); 

const app = express(); 

app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
const PORT = 5000; 

const server = http.createServer(app);
app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.send({ message: "API is working!" });
});

app.use("/api", quizRouter); 
app.use("/users", UsersRouter);

// הגדרת Socket.IO לשרת HTTP
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"], 
  },
});

// אובייקט שמכיל את Socket IDs של המשתמשים
let userSockets = {};

io.on("connection", (socket) => {
  // רישום משתמש עם מזהה ייחודי (userIdentifier)
  socket.on("registerUser", (userIdentifier) => {
    userSockets[userIdentifier] = socket.id; // שמירת Socket ID של המשתמש
    console.log(`User registered: ${userIdentifier}`);
  });

  socket.on("shareQuiz", ({ userEmail, quizContent }) => {
    const targetSocketId = userSockets[userEmail]; // בדיקת האם יש ID עבור המייל

    if (targetSocketId) {
      // שליחה של החידון למשתמש המתאים
      io.to(targetSocketId).emit("receiveQuiz", quizContent);
      console.log(`Quiz shared with ${userEmail}`);
    } else {
      console.log(`No socket found for ${userEmail}`);
    }
  });
});

// // אירוע נוסף לשיתוף תשובות חידון לכל המשתמשים
// io.on("connection", (socket) => {
//   socket.on("shareAnswers", (data) => {
//     const { userEmail, answers } = data;

//     // שליחה של התשובות לכל הלקוחות המחוברים
//     io.emit("receiveAnswers", {
//       userEmail,
//       answers,
//     });
//   });
// });


io.on("connection", (socket) => {
  // רישום Socket ID עבור משתמש
  socket.on("registerUser", (userId) => {
    userSockets[userId] = socket.id; // שמירת Socket ID
    console.log(`User registered with ID: ${userId}`);
  });


  socket.on("shareQuiz", ({ userId, quizContent }) => {
    console.log(`Attempting to share quiz with user ID: ${userId}`);

    if (userId) {
      io.to(userId).emit("receiveQuiz", quizContent); // שליחה למשתמש
      console.log(`Shared quiz with user ID: ${userId}`);
    } else {
      console.error(`User ID ${userId} not found or not registered`);
    }
  });


  socket.on("submitQuiz", (data) => {
    const { score, answers } = data;
    console.log(`Received score: ${score}`);
    console.log(`Answers: ${answers}`);

    io.emit("receiveScore", { score, answers }); // שידור לכולם
  });

  socket.on("disconnect", () => {
    for (let userId in userSockets) {
      if (userSockets[userId] === socket.id) {
        delete userSockets[userId]; // מחיקת המשתמש שהתחבר
      }
    }
  });
});

// הרצת השרת
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
