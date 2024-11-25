const db = require('../DBQUIZ');

class UserModel {
    // קבלת משתמש לפי אימייל
    static async getUserByEmail(email) {
        try {
            const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
            return rows[0] || null;
        } catch (error) {
            console.error('Error in getUserByEmail:', error);
            throw new Error('Database error while fetching user');
        }
    }

    // קבלת משתמש לפי ID
    static async getUserById(userId) {
        try {
            const [rows] = await db.execute('SELECT * FROM users WHERE userID = ?', [userId]);
            return rows[0] || null;
        } catch (error) {
            console.error('Error in getUserById:', error);
            throw new Error('Database error while fetching user');
        }
    }

    // יצירת משתמש חדש
    static async createUser(userName, email, hashedPassword) {
        try {
            const [result] = await db.execute(
                'INSERT INTO users (userName, email, password) VALUES (?, ?, ?)',
                [userName, email, hashedPassword]
            );
            
            // מחזיר את המשתמש המלא שנוצר
            const newUser = await this.getUserById(result.insertId);
            return newUser;
        } catch (error) {
            console.error('Error in createUser:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Email already exists');
            }
            throw new Error('Database error while creating user');
        }
    }
}

module.exports = UserModel;