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
        allowNull: false,
        references: {
            model: Prova,
            key: 'data'
        }
    },
    instituicao: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    cod_prova: {
        Type: DataTypes.INTERGER,
        allowNull: false, 
        references: {
            model: Prova,
            key: 'cod_prova'
        }   
    }
});

module.exports = cabecalho;
