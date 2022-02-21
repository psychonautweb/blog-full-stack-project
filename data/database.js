const mysql = require('mysql2/promise');  // npm install --save mysql2 - adds package, and enables promises for all query

const pool = mysql.createPool({
    host: 'localhost',
    database: 'blog',
    user: 'root',
    password: 'rookie'
}); // connects to db and creates a pool of connection

module.exports = pool; // exports the pool and imports to all the files where we run query agains that database
//mysql package will manage that