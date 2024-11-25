const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // צריך להתקין: npm install jsonwebtoken
const UserModel = require('../models/UserModel');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // יש להגדיר ב-.env

// פונקציה להסרת סיסמה מאובייקט המשתמש
const sanitizeUser = (user) => {
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

const registerUser = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const existingUser = await UserModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.createUser(userName, email, hashedPassword);

        // יצירת טוקן
        const token = jwt.sign(
            { userId: newUser.userID, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: "User registered successfully!",
            user: sanitizeUser(newUser),
            token
        });
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ error: error.message || "An error occurred during registration." });
    }
};

const logInUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const user = await UserModel.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // יצירת טוקן
        const token = jwt.sign(
            { userId: user.userID, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful",
            user: sanitizeUser(user),
            token
        });
    } catch (error) {
        console.error("Error in logInUser:", error);
        res.status(500).json({ error: error.message || "An error occurred during login." });
    }
};

module.exports = {
    registerUser,
    logInUser
};