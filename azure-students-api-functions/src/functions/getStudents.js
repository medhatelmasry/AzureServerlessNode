const { app } = require('@azure/functions');
const { connectToDatabase } = require('../shared/database');

app.http('getStudents', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'students',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        try {
            context.log('Attempting to connect to database...');
            context.log('Connection string length:', process.env.SQL_SERVER_CONNECTION_STRING ? process.env.SQL_SERVER_CONNECTION_STRING.length : 0);
            
            const pool = await connectToDatabase();
            context.log('Database connection successful');
            
            const result = await pool.request().query('SELECT * FROM Students');
            context.log(`Retrieved ${result.recordset.length} students`);
            
            return {
                status: 200,
                jsonBody: result.recordset
            };
        } catch (error) {
            context.log.error(`Error retrieving students: ${error.message}`);
            context.log.error(`Stack trace: ${error.stack}`);
            return {
                status: 500,
                body: `Error retrieving students: ${error.message}`
            };
        }
    }
});