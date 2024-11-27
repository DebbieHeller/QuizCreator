const express = require('express'); 
const router = express.Router();
const UserController = require('../controllers/UserController'); // מוודאים שהנתיב לקובץ הקונטרולר נכון


// יצירת מסלול POST לשמירת משתמש חדש
router.post('/signUp', UserController.registerUser);
router.post('/logIn', UserController.logInUser);
router.get("/", async (req, res) => {
    try {
        const email = req.query.email; // שליפת המייל מתוך ה-query parameters
        const userId = await UserController.getUserId(email, res); // שליחה לפונקציה
        
        if (userId) {
            console.log("in route"+userId)
            // אם הצלחנו לשלוף את ה-ID, מחזירים אותו ב-json
            return res.status(200).json(userId ); // מחזירים את ה-ID ב-json
        } else {
            return res.sendStatus(404); // אם לא מצאנו את המשתמש
        }
    } catch (error) {
        res.status(500).send({ error: "Failed to fetch users" });
    }
});

  

module.exports = router;
