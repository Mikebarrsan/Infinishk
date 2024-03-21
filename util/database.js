const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'VIAPAGO',
    password: 'Queretaro2017#'
});

module.exports = pool.promise();