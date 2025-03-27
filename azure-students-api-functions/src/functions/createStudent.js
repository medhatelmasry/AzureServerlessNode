const { app } = require('@azure/functions');
const sql = require('mssql');
const { connectToDatabase } = require('../shared/database');
const { Student } = require('../shared/studentModel');

app.http('createStudent', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'students',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const body = await request.json();
        const { FirstName, LastName, School } = body;

        if (!FirstName || !LastName || !School) {
            return {
                status: 400,
                body: "Please provide FirstName, LastName, and School."
            };
        }

        try {
            const pool = await connectToDatabase();
            const result = await pool.request()
                .input('FirstName', sql.VarChar, FirstName)
                .input('LastName', sql.VarChar, LastName)
                .input('School', sql.VarChar, School)
                .query('INSERT INTO Students (FirstName, LastName, School) VALUES (@FirstName, @LastName, @School); SELECT SCOPE_IDENTITY() AS StudentId;');

            return {
                status: 201,
                jsonBody: {
                    StudentId: result.recordset[0].StudentId,
                    FirstName,
                    LastName,
                    School
                }
            };
        } catch (err) {
            context.log.error('SQL error', err);
            return {
                status: 500,
                body: "Error creating student record."
            };
        }
    }
});
