const { DataTypes } = require('sequelize');

const Student = {
    StudentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    FirstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    LastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    School: {
        type: DataTypes.STRING,
        allowNull: false
    }
};

module.exports = Student;