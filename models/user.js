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


    static updateUserDetails(userId, newPassword, updatedUserDetails) {
        // Constructing the SQL query dynamically based on the updated user details
        let updateQuery = 'UPDATE account SET ';
        const queryParams = [];
      
        // Iterate through the updatedUserDetails object to build the query
        for (const [key, value] of Object.entries(updatedUserDetails)) {
          updateQuery += `${key} = ?, `;
          queryParams.push(value);
        }
      
        // Add the new password to the query parameters
        queryParams.push(newPassword);
      
        // Remove the last comma and add the WHERE clause
        updateQuery = updateQuery.slice(0, -2) + ' WHERE aid = ?';
      
        // Add the userId to the query parameters
        queryParams.push(userId);
      
        // Execute the update query
        return db.execute(updateQuery, queryParams);
      }
      

    
};

