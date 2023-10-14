const config = require('../../config');
const database = require('../../mysql/database.connect');

class DB_Services {
    // Phuong thuc ket noi csdl
    async connection () {
        const database_connection = await database.connect(config.db);
        return database_connection;
    }

    // Them du lieu vao db
    async insertDB (query) {
        const db = this.connection();
        const data = (await db).execute(query);
        return data.then((data, err) => {
            if (err) return false;
            return true;
        });
    }

    // Lay du lieu tu db
    async updateDB (query) {
        const db = this.connection();
        const data = (await db).execute(query);
        return data.then((data, err) => {
            if (err) return false;
            return true;
        });
    }
}

module.exports = new DB_Services;
