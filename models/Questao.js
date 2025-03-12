const Usuario = require('./Usuario');
const Assunto = require('./Assunto'); 
const { Sequelize, DataTypes } = require('sequelize');
const sq = require('../config/database.js');


const Questao = sq.sequelize.define('Questao', { 
    cod_questao: {
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    }, 
    enunciado: { 
        type: DataTypes.STRING(1000), 
        allowNull: false 
    }, 
    resposta: { 
        type: DataTypes.STRING(250), 
        allowNull: false 
    }, 
    cod_usuario: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { 
            model: Usuario, 
            key: 'cod_usuario' }
    }, 
    cod_assunto: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references:{
            model: Assunto, 
            key: 'cod_assunto' } 
    }

},{
    modelName: 'questao',
    tableName: 'questao',
    timestamps: false 

});

model: Usuario, Assunto;
module.exports = Questao;