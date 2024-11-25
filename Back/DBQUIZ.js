const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // החלף בשם המשתמש שלך
  password: 'TXB,ajur16', // החלף בסיסמה שלך
  database: 'quiz_app', // החלף בשם מסד הנתונים שלך
  port: 3306, // ברירת המחדל ל-MySQL
});

module.exports = pool;
