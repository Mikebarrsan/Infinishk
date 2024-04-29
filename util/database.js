const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'via_pago',
    password: ''
});

module.exports = pool.promise();