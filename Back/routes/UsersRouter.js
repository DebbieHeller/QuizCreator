const express = require('express'); 
const router = express.Router();
const UserController = require('../controllers/UserController'); // מוודאים שהנתיב לקובץ הקונטרולר נכון

console.log("userRouter initialized"); // הוספת לוג לבדיקת אתחול הראוטר

// יצירת מסלול POST לשמירת משתמש חדש
router.post('/signUp', UserController.registerUser);
router.post('/logIn', UserController.logInUser);

module.exports = router;
