const Assunto = require('./Assunto'); 
const Usuario= require('./Usuario.js');
const { Sequelize, DataTypes } = require('sequelize');
const sq = require('../config/database.js');

const Prova = sq.sequelize.define('Prova', { 
    cod_prova: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true }, 
        
    nome_prova: { 
        type: DataTypes.STRING(50), 
        allowNull: false 
    }, 
    data: { 
        type: DataTypes.DATE, 
        unique: true, 
        allowNull: false 
    }, 
    cod_assunto: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { 
            model: Assunto,
            key: 'cod_assunto' 
        } 
    },
    cod_usuario:{
        type: DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Usuario,
            key:"cod_usuario"
        }
    }
},{
    modelName: 'prova',
    tableName: 'prova',
    timestamps: false 
});

module.exports = Prova;