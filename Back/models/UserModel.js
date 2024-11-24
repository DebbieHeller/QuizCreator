const db = require('../DBQUIZ'); // לוודא שהנתיב לקובץ הקונפיגורציה של מסד הנתונים נכון

// פונקציה לבדוק אם משתמש עם אותו אימייל כבר קיים
const getUserByEmail = async (email) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
};

// פונקציה ליצירת משתמש חדש
const createUser = async (userName, email, hashedPassword) => {
    const [result] = await db.execute(
        'INSERT INTO users (userName, email, password) VALUES (?, ?, ?)',
        [userName, email, hashedPassword]
    );
    return result.insertId; // מחזיר את ה-ID של המשתמש שנוצר
};

module.exports = {
    getUserByEmail,
    createUser,
};
