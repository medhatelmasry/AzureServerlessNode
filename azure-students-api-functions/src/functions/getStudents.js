const { app } = require('@azure/functions');
const { connectToDatabase } = require('../shared/database');

app.http('getStudents', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'students',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        try {
            const pool = await connectToDatabase();
            const result = await pool.request().query('SELECT * FROM Students');
            
            return {
                status: 200,
                jsonBody: result.recordset
            };
        } catch (error) {
            context.log.error('Error retrieving students:', error);
            return {
                status: 500,
                body: `Error retrieving students: ${error.message}`
            };
        }
    }
});