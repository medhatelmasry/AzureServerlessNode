const sql = require('mssql');

// Parse the connection string from environment variables
const connectionString = process.env.SQL_SERVER_CONNECTION_STRING;

async function connectToDatabase() {
    try {
        console.log('Attempting database connection...');
        
        if (!connectionString) {
            console.error('SQL_SERVER_CONNECTION_STRING environment variable is not set');
            throw new Error('Database connection string is not configured');
        }
        
        const pool = await sql.connect(connectionString);
        console.log('Database connection established successfully');
        return pool;
    } catch (err) {
        console.error('Database connection failed:', err.message);
        console.error('Stack trace:', err.stack);
        throw err;
    }
}

module.exports = {
    connectToDatabase
};