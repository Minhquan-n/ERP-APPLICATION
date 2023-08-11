const mysql = require('mysql2/promise');
const bluebird = require('bluebird');

class DB {
    async connect(db) {
        const connection = await mysql.createConnection({
            host: db.host,
            port: db.port,
            user:db.user,
            password: db.password,
            database: db.database,
            Promise: bluebird
        });
        return connection;
    }
}

module.exports = new DB;