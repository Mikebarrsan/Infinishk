const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'viapago',
    password: ''
});

module.exports = pool.promise();