const { app } = require('@azure/functions');
const sql = require('mssql');
const { connectToDatabase } = require('../shared/database');

app.http('updateStudent', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'students/{StudentId}',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        // Extract StudentId from URL params
        const StudentId = request.params.StudentId;
        
        // Get request body
        const body = await request.json();
        const { FirstName, LastName, School } = body;

        if (!StudentId || !FirstName || !LastName || !School) {
            return {
                status: 400,
                jsonBody: { message: "Please provide FirstName, LastName, and School." }
            };
        }

        try {
            const pool = await connectToDatabase();
            const result = await pool.request()
                .input('StudentId', sql.Int, StudentId)
                .input('FirstName', sql.VarChar, FirstName)
                .input('LastName', sql.VarChar, LastName)
                .input('School', sql.VarChar, School)
                .query('UPDATE Students SET FirstName = @FirstName, LastName = @LastName, School = @School WHERE StudentId = @StudentId');

            if (result.rowsAffected[0] === 0) {
                return {
                    status: 404,
                    jsonBody: { message: "Student not found." }
                };
            } else {
                return {
                    status: 200,
                    jsonBody: { 
                        message: "Student updated successfully.",
                        student: {
                            StudentId,
                            FirstName,
                            LastName, 
                            School
                        }
                    }
                };
            }
        } catch (err) {
            context.log.error('Error updating student:', err);
            return {
                status: 500,
                jsonBody: { message: "Error updating student: " + err.message }
            };
        }
    }
});