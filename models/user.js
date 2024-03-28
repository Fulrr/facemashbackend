const db = require('../util/database');

module.exports = class User {
    constructor(avatar_img, name, email, password) {
        this.avatar_img = avatar_img;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    static find(email) {
        return db.execute('SELECT * FROM account WHERE email = ?',[email]);
    }

    static finduserId(userId) {
        return db.execute('SELECT * FROM account WHERE aid = ?',[userId]);
    }


    static save(user) {
        return db.execute(
            'INSERT INTO account (avatar_img, name, email, password) VALUES (?, ?, ?, ?)',
            [user.avatar_img, user.name, user.email, user.password]
        )
    }

    static getCurrentUser() {
        return db.execute('SELECT name FROM account',);
    }

    static getaccount() {
        return db.execute('SELECT * FROM account',);
    }

    static updatePassword(userId, newPassword) {
        return db.execute(
          'UPDATE account SET password = ? WHERE aid = ?',
          [newPassword, userId]
        );
      }
      

      static updateUserDetails(userId, updatedUserDetails) {
        let updateQuery = 'UPDATE account SET ';
        const queryParams = [];
        
        // Iterate through the updatedUserDetails object to build the query
        for (const [key, value] of Object.entries(updatedUserDetails)) {
          updateQuery += `${key} = ?, `;
          queryParams.push(value);
        }
        
        // Remove the trailing comma and space
        updateQuery = updateQuery.slice(0, -2);
      
        // Add the WHERE clause
        updateQuery += ' WHERE aid = ?';
        queryParams.push(userId);
        
        // Execute the update query
        return db.execute(updateQuery, queryParams);
      }
      
      

    
};

