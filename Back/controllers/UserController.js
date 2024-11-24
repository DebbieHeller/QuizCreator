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


const logInUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // בדוק אם כל השדות קיימים
        if (!email || !password) {
            return res.status(400).send("Email and password are required.");
        }

        // בדוק אם המשתמש קיים
        const existingUser = await UserModel.getUserByEmail(email);
        if (!existingUser) {
            return res.status(401).send("Unauthorized: Incorrect email or password");
        }

        // בדוק אם הסיסמא נכונה
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(401).send("Unauthorized: Incorrect email or password");
        }

        res.status(200).send({ message: "Login successful", user: existingUser });
    } catch (error) {
        console.error("Error in logInUser:", error);
        res.status(500).send("An error occurred during login.");
    }
};

module.exports = {
    registerUser,logInUser
};
