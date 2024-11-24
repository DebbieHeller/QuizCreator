const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');

const registerUser = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        // בדיקה אם כל השדות קיימים
        if (!userName || !email || !password) {
            return res.status(400).send("All fields are required.");
        }

        // בדיקת ייחודיות אימייל
        const existingUser = await UserModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).send("Email is already registered.");
        }

        // הצפנת הסיסמה
        const hashedPassword = await bcrypt.hash(password, 10);

        // יצירת המשתמש
        const userID = await UserModel.createUser(userName, email, hashedPassword);

        res.status(201).send({ message: "User registered successfully!", userID });
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).send("An error occurred during registration.");
    }
};

module.exports = {
    registerUser
};
