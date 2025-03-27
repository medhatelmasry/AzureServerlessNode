const { app } = require('@azure/functions');
const sql = require('mssql');
const { connectToDatabase } = require('../shared/database');

app.http('deleteStudent', {
    methods: ['DELETE'],
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
                .query('DELETE FROM Students WHERE StudentId = @StudentId');

            if (result.rowsAffected[0] === 0) {
                return {
                    status: 404,
                    body: "Student not found."
                };
            } else {
                return {
                    status: 204
                };
            }
        } catch (err) {
            context.log.error('Error deleting student:', err);
            return {
                status: 500,
                body: "Error deleting student: " + err.message
            };
        }
    }
});