const sql = require('mssql');

// Parse the connection string from environment variables
const connectionString = process.env.SQL_SERVER_CONNECTION_STRING;

async function connectToDatabase() {
    try {
        const pool = await sql.connect(connectionString);
        return pool;
    } catch (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
}

module.exports = {
    connectToDatabase
};
