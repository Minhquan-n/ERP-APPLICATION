require('dotenv').config();

const config = {
    app: {
        port: process.env.PORT, //PORT = 3000 
    },
    db: {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    }
};

module.exports = config;