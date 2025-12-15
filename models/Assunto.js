const { Sequelize, DataTypes } = require('sequelize');
const sq = require('../config/database.js');

const Assunto = sq.sequelize.define('Assunto', {
    cod_assunto: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome_assunto: {
        type: DataTypes.STRING(150),
        allowNull: false
    }
},{
    modelName: 'assunto',
    tableName: 'assunto',
    timestamps: false 
});
module.exports = Assunto;