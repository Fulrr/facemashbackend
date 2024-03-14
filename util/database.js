const mysql = require('mysql2');

const config = require('../config/config.json');

const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    database: config.database,
    password: config.password,
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Connection to the database is lost');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Too many connections to the database');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Connection fail');
        }
    }

    if (connection) {
        connection.release();
        console.log('Connected to the database');
    }

    return;
});


module.exports = pool.promise();