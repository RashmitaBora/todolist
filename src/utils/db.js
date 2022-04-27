/* const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../../.env')}) */
const mysql = require('promise-mysql')

module.exports.mySqlConn = async () => {
    const db = await mysql.createPool({
        connectionLimit: 100,
        connectTimeout: 60*60*1000,
        acquireTimeout: 60*60*1000,
        timeout: 60*60*1000,
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'todo_db',
        port: process.env.PORT,
    })
    return db;
}