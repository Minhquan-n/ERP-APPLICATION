const app = require('./app');
const config = require('./app/config');
const database = require('./app/mysql/database.connect');

async function startServe() {
    try {
        await database.connect(config.db);
        const PORT = config.app.port;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log('Cannot connect to database');
        process.exit();
    }
}

startServe();