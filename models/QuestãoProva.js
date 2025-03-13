const { Sequelize, DataTypes } = require('sequelize');
const sq = require('../config/database.js');
const Prova = require('./Prova.js'); 
const Questao = require('./Questao.js'); 

const QuestaoProva = sq.sequelize.define('QuestaoProva', { 
    cod_prova: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { 
            model: Prova, 
            key: 'cod_prova' 
        } 
    }, 
    cod_questao: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: 
        {   model: Questao, 
            key: 'cod_questao' 
        } 
    } 
}, 
{
    modelName: 'questaoprova',
    tableName: 'questaoprova',
    timestamps: false,
    freezeTableName: true,
});

QuestaoProva.removeAttribute('id');
model: Prova, Questao;
module.exports = QuestaoProva;
