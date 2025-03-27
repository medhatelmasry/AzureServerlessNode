const { app } = require('@azure/functions');
const { connectToDatabase } = require('../shared/database');
const sql = require('mssql');

app.http('getStudent', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'students/{StudentId}',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const StudentId = request.params.StudentId;

        if (!StudentId) {
            return {
                status: 400,
                body: "Please provide a StudentId."
            };
        }

        try {
            const pool = await connectToDatabase();
            const result = await pool.request()
                .input('StudentId', sql.Int, StudentId)
                .query('SELECT * FROM Students WHERE StudentId = @StudentId');

            if (result.recordset.length === 0) {
                return {
                    status: 404,
                    body: "Student not found."
                };
            } else {
                return {
                    status: 200,
                    jsonBody: result.recordset[0]
                };
            }
        } catch (err) {
            context.log.error('Error retrieving student:', err);
            return {
                status: 500,
                body: "Error retrieving student: " + err.message
            };
        }
    }
});