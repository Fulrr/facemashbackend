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

    
};

