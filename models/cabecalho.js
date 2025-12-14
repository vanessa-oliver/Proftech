const { Sequelize, DataTypes } = require('sequelize');
const sq = require('../config/database.js');
const Prova = require('./Prova.js');

const cabecalho = sq.sequelize.define('cabecalho', {    
    cod_cabecalho: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false
    },
    instituicao: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    cod_prova: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        references: {
            model: Prova,
            key: 'cod_prova'
        }   
    }
},{
    modelName: 'cabecalho',
    tableName: 'cabecalho',
    timestamps: false
});

module.exports = cabecalho;
