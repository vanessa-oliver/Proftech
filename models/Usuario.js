const { Sequelize, DataTypes } = require('sequelize');
const sq = require('../config/database.js');

const Usuario = sq.sequelize.define('usuario', {
    cod_usuario: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
    },
    nome: { 
        type: DataTypes.STRING, 
        allowNull: false 
    }, 
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    }, 
    eAdmin: {
        type: DataTypes.INTEGER, 
        allowNull: false, 
        defaultValue: 0
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false
    },
}, 
{
    tableName: 'usuario', 
    timestamps: false 
});

module.exports = Usuario;

    